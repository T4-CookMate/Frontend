// 마이크 소리를 받아서 PCM(Int16)으로 변환하고
// WebSocket으로 보내고 디버그용 WAV 파일까지 만들어주는 훅

import { useCallback, useEffect, useRef, useState } from "react";

// STT 서버에서 많이 사용하는 표준 샘플레이트 (16kHz)
const SAMPLE_RATE = 16000;

export function usePcmStream(wsUrl?: string) {
  // 실제 AudioContext에서 사용하는 샘플레이트 (디버그용)
  const [debugSampleRate, setDebugSampleRate] = useState<number>(SAMPLE_RATE);

  // 내부에서 계속 유지할 객체들 (Ref)
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  // WebSocket 연결
  const wsRef = useRef<WebSocket | null>(null);

  // 스트리밍 중인지 여부 (UI 표시용)
  const [isStreaming, setIsStreaming] = useState(false);

  // 디버그용 상태
  const [chunkCount, setChunkCount] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);

  // 디버그용: 녹음된 PCM을 메모리에 저장
  const recordedChunksRef = useRef<Int16Array[]>([]);

  // 디버그용: stop() 후 브라우저에서 재생할 WAV URL
  const [debugAudioUrl, setDebugAudioUrl] = useState<string | null>(null);

  const [isWsOpen, setIsWsOpen] = useState(false);

  // ✅ 중복 stop 방지
  const isStoppingRef = useRef(false);

  // ✅ END를 받았는지 / TTS 재생 조각 카운트
  const endingRef = useRef(false);
  const playingCountRef = useRef(0);

  // ✅ onmessage 안에서 stop()을 부르기 위한 ref (선언 순서 문제 해결)
  const stopRef = useRef<() => void>(() => {});
//   const requestStop = useCallback(() => stopRef.current(), []);

  // ✅ WS+AudioContext만 닫는 “마지막 종료” (TTS 끝까지 듣고 닫을 때 사용)
  const finalClose = useCallback(() => {
    console.log("[usePcmStream] finalClose()");

    // AudioContext 종료
    audioContextRef.current?.close();
    audioContextRef.current = null;

    // WebSocket 종료
    if (wsRef.current) {
      try {
        wsRef.current.onopen = null;
        wsRef.current.onmessage = null;
        wsRef.current.onerror = null;
        wsRef.current.onclose = null;

        if (
          wsRef.current.readyState === WebSocket.OPEN ||
          wsRef.current.readyState === WebSocket.CONNECTING
        ) {
          wsRef.current.close();
        }
      } catch (e) {
        console.warn("[usePcmStream] finalClose ws close failed", e);
      } finally {
        wsRef.current = null;
      }
    }

    setIsWsOpen(false);
  }, []);

  // ✅ 마이크 송신만 멈추는 함수 (END 시: “녹음 중단” + “TTS는 끝까지 수신/재생”)
  const stopCaptureOnly = useCallback(() => {
    console.log("[usePcmStream] stopCaptureOnly()");

    sourceRef.current?.disconnect();
    processorRef.current?.disconnect();

    sourceRef.current = null;
    processorRef.current = null;

    // UI에서 녹음중 표시만 끄기
    setIsStreaming(false);
  }, []);

  // 서버에서 온 PCM을 재생하는 헬퍼
  const playPcmFromServer = useCallback(
    (arrayBuffer: ArrayBuffer) => {
      const audioContext = audioContextRef.current;
      if (!audioContext) {
        console.warn("AudioContext 없음 – 아직 start() 안 된 상태일 수 있어요");
        return;
      }

      // 서버가 보내준 건 16bit PCM(모노)라고 가정
      const pcm16 = new Int16Array(arrayBuffer);
      const numSamples = pcm16.length;

      const audioBuffer = audioContext.createBuffer(1, numSamples, SAMPLE_RATE);
      const channelData = audioBuffer.getChannelData(0);

      // Int16 -> Float32(-1.0 ~ 1.0)
      for (let i = 0; i < numSamples; i++) {
        channelData[i] = pcm16[i] / 0x8000;
      }

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);

      // ✅ 재생 중 카운트 증가
      playingCountRef.current += 1;

      source.onended = () => {
        playingCountRef.current -= 1;

        // ✅ END 받은 상태이고 더 재생할 조각이 없으면 그때 최종 종료
        if (endingRef.current && playingCountRef.current <= 0) {
          finalClose();
        }
      };

      source.start();
    },
    [finalClose]
  );

  // stop() - 음성 스트림 “완전 종료” (+ 디버그 WAV 생성)
  const stop = useCallback(() => {
    if (!isStreaming && !wsRef.current && !audioContextRef.current) return;
    if (isStoppingRef.current) return;
    isStoppingRef.current = true;

    console.log("[usePcmStream] stop() called");

    // 오디오 노드 연결 해제
    sourceRef.current?.disconnect();
    processorRef.current?.disconnect();
    sourceRef.current = null;
    processorRef.current = null;

    // 디버그용 WAV 파일 생성 (원하면 유지)
    const recorded = recordedChunksRef.current;
    if (recorded.length > 0) {
      const totalSamples = recorded.reduce((sum, arr) => sum + arr.length, 0);
      const merged = new Int16Array(totalSamples);

      let offset = 0;
      for (const chunk of recorded) {
        merged.set(chunk, offset);
        offset += chunk.length;
      }

      const wavBuffer = encodeWav(merged, debugSampleRate);
      const blob = new Blob([wavBuffer], { type: "audio/wav" });
      const url = URL.createObjectURL(blob);
      setDebugAudioUrl(url);
    }

    // ✅ END 대기 상태도 초기화
    endingRef.current = false;
    playingCountRef.current = 0;

    // ✅ 완전 종료
    finalClose();

    setIsStreaming(false);
    setIsWsOpen(false);
  }, [debugSampleRate, isStreaming]);

  // ✅ stopRef에 최신 stop 연결
  useEffect(() => {
    stopRef.current = stop;
  }, [stop]);

  // ✅ 새로고침/뒤로가기/탭닫기 등 페이지 이탈 시 “즉시 완전 종료”
  useEffect(() => {
    const cleanup = () => {
      stopRef.current?.();
    };

    window.addEventListener("beforeunload", cleanup);
    window.addEventListener("pagehide", cleanup);

    const onVis = () => {
      if (document.visibilityState === "hidden") cleanup();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("beforeunload", cleanup);
      window.removeEventListener("pagehide", cleanup);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // start() - 음성 스트림 시작
  const start = useCallback(async () => {
    console.log("[usePcmStream] start() called");

    if (isStreaming) return;

    // start하면 stop 가드/END 상태 초기화
    isStoppingRef.current = false;
    endingRef.current = false;
    playingCountRef.current = 0;

    // 0. WebSocket 연결
    if (wsUrl) {
      try {
        const ws = new WebSocket(wsUrl);
        ws.binaryType = "arraybuffer";
        wsRef.current = ws;

        ws.onopen = () => {
          setIsWsOpen(true);
          console.log("[usePcmStream] WS OPEN");
        };

        ws.onmessage = (event) => {
            if (typeof event.data === "string") {
                const raw = event.data.trim().replace(/^"|"$/g, "");
                console.log("[WS] TEXT FROM SERVER:", raw);

                // 1) JSON 메타 메시지 우선 파싱 시도
                try {
                const obj = JSON.parse(raw);

                // ✅ 진짜 종료 트리거: closeAfterSend === true
                if (obj?.closeAfterSend === true) {
                    console.log("[WS] closeAfterSend=true -> stopCaptureOnly(), wait TTS then close");
                    endingRef.current = true;

                    // 마이크 송신만 중단 (TTS 수신/재생은 계속)
                    stopCaptureOnly();

                    // 이미 재생 중인 조각 없으면 즉시 종료
                    if (playingCountRef.current <= 0) finalClose();
                    return;
                }

                // 필요하면 다른 메타도 여기서 처리
                // ex) obj.type === "STT_RESULT" ...
                return;
                } catch {
                // JSON 아니면 그냥 평문 텍스트로 처리
                }

                // 2) ✅ END는 “종료 트리거”가 아님 (그냥 안내/상태 표시용)
                if (raw === "END") {
                console.log("[WS] END received (NOT closing).");
                // TODO: 화면에서 레시피 끝났다고 표시만 하고 아무것도 끊지 말기
                return;
                }

                // 기타 텍스트(STT 결과 등)
                return;
            }

  // 바이너리(TTS PCM)
  if (event.data instanceof ArrayBuffer) {
    console.log("[WS] BINARY FROM SERVER (TTS PCM):", event.data.byteLength);
    playPcmFromServer(event.data);
    return;
  }

  console.log("[WS] UNKNOWN MESSAGE TYPE", event.data);
};


        ws.onerror = (err) => {
          console.warn("WebSocket 연결 에러, 녹음은 로컬에서만 진행합니다.", err);
        };

        ws.onclose = () => {
          setIsWsOpen(false);
          console.log("[usePcmStream] WS CLOSED");
        };
      } catch (e) {
        console.warn("WebSocket 생성 실패, 녹음은 로컬에서만 진행합니다.", e);
      }
    }

    // 1. 마이크 권한 요청
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log("[usePcmStream] mic stream acquired");

    // 오디오 컨텍스트 생성
    const audioContext = new AudioContext({ sampleRate: 16000 });
    audioContextRef.current = audioContext;

    setDebugSampleRate(audioContext.sampleRate);

    // WS 열려있으면 READY 보냄
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send("READY");
      console.log("READY sent");
    }

    // 마이크 스트림을 AudioContext에 연결
    const source = audioContext.createMediaStreamSource(stream);
    sourceRef.current = source;

    // PCM 데이터를 콜백으로 받을 Processor Node
    const processor = audioContext.createScriptProcessor(4096, 1, 1);
    processorRef.current = processor;

    // 디버그 정보 초기화
    setChunkCount(0);
    setTotalBytes(0);
    recordedChunksRef.current = [];
    setDebugAudioUrl(null);

    processor.onaudioprocess = (e) => {
      const input = e.inputBuffer.getChannelData(0);
      const pcm16 = float32ToInt16(input);

      // WebSocket이 살아 있으면 서버에 전송
      if (wsRef.current) {
        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(pcm16.buffer);
          console.log("📤 sent chunk", pcm16.byteLength);
        } else {
          console.log("⚠️ ws not open, readyState =", wsRef.current.readyState);
        }
      }

      recordedChunksRef.current.push(pcm16);
      setChunkCount((c) => c + 1);
      setTotalBytes((b) => b + pcm16.byteLength);
    };

    source.connect(processor);
    processor.connect(audioContext.destination);

    setIsStreaming(true);
  }, [isStreaming, wsUrl, playPcmFromServer, stopCaptureOnly, finalClose]);

  return {
    start,
    stop, // 수동 종료(즉시 완전 종료)용
    isStreaming,
    isWsOpen,
    chunkCount,
    totalBytes,
    debugAudioUrl,
  };
}

// Float32 배열(브라우저 기본 오디오 형식) → Int16 PCM 변환
function float32ToInt16(float32Array: Float32Array): Int16Array {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return int16Array;
}

// pure PCM(Int16Array) → WAV 파일로 변환 (헤더 붙이기)
function encodeWav(samples: Int16Array, sampleRate: number): ArrayBuffer {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  const numChannels = 1;
  const bitsPerSample = 16;

  writeString(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, (sampleRate * numChannels * bitsPerSample) / 8, true);
  view.setUint16(32, (numChannels * bitsPerSample) / 8, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, "data");
  view.setUint32(40, samples.length * 2, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    view.setInt16(offset, samples[i], true);
  }

  return buffer;
}
