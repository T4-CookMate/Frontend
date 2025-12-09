// 마이크 소리를 받아서 PCM(Int16)으로 변환하고
// WebSocket으로 보내고 디버그용 WAV 파일까지 만들어주는 훅

import { useCallback, useRef, useState } from "react";

// STT 서버에서 많이 사용하는 표준 샘플레이트 (16kHz)
const SAMPLE_RATE = 16000;

export function usePcmStream(wsUrl?: string) {

    // 실제 AudioContext에서 사용하는 샘플레이트 (디버그용)
    const [debugSampleRate, setDebugSampleRate] = useState<number>(SAMPLE_RATE);

    // 내부에서 계속 유지할 객체들 (Ref)
    // 브라우저 오디오 시스템 객체
    const audioContextRef = useRef<AudioContext | null>(null);

    // 마이크 입력 스트림 -> 오디오 처리 노드로 연결하는 객체
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

    // 오디오 데이터를 콜백으로 받는 처리 노드
    const processorRef = useRef<ScriptProcessorNode | null>(null);

    // WebSocket 연결
    const wsRef = useRef<WebSocket | null>(null);

    // 스트리밍 중인지 여부 (UI 표시용)
    const [isStreaming, setIsStreaming] = useState(false);

    // 디버그용 상태
    // 몇 개의 PCM 청크를 보냈는지
    const [chunkCount, setChunkCount] = useState(0);

    // 총 몇 바이트 전송했는지
    const [totalBytes, setTotalBytes] = useState(0);

    // 디버그용: 녹음된 PCM을 메모리에 저장
    const recordedChunksRef = useRef<Int16Array[]>([]);

    // 디버그용: stop() 후 브라우저에서 재생할 WAV URL
    const [debugAudioUrl, setDebugAudioUrl] = useState<string | null>(null);

    // start() - 음성 스트림 시작
    const start = useCallback(async () => {
    // 이미 시작 상태면 아무것도 안 함
    if (isStreaming) return;

    // 0. (선택) WebSocket 연결 시도
    //    wsUrl이 넘겨졌을 때만 WebSocket을 만든다.
    if (wsUrl) {
        try {
        const ws = new WebSocket(wsUrl);
        ws.binaryType = "arraybuffer"; // PCM 바이너리 전송을 위해서
        wsRef.current = ws;

        ws.onopen = () => {
            // 서버에게 음성 보냄을 알림
            ws.send(
            JSON.stringify({
                type: "START",
                sampleRate: SAMPLE_RATE,
            })
            );
        };

        ws.onerror = (err) => {
            console.warn("WebSocket 연결 에러, 녹음은 로컬에서만 진행합니다.", err);
        };
        } catch (e) {
        console.warn("WebSocket 생성 실패, 녹음은 로컬에서만 진행합니다.", e);
        }
    }

    // 1. 마이크 권한 요청  (★ 이 부분은 이제 WS와 상관 없이 항상 실행됨)
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // 오디오 컨텍스트 생성 (백엔드가 요청하는 sampleRate 형식으로 맞춰야함)
    const audioContext = new AudioContext({ sampleRate: 16000 });
    audioContextRef.current = audioContext;

    // 디버그용: 브라우저가 실제로 쓰는 샘플레이트 기록
    setDebugSampleRate(audioContext.sampleRate);

    // 마이크 스트림을 AudioContext에 연결
    const source = audioContext.createMediaStreamSource(stream);
    sourceRef.current = source;

    // 2. PCM 데이터를 콜백으로 받을 Processor Node
    // bufferSize = 4096 -> 약 0.1초 단위로 콜백 발생
    const processor = audioContext.createScriptProcessor(4096, 1, 1);
    processorRef.current = processor;

    // 디버그 정보 초기화
    setChunkCount(0);
    setTotalBytes(0);
    recordedChunksRef.current = [];
    setDebugAudioUrl(null);

    // 3. 실제로 PCM 데이터 받을 콜백
    processor.onaudioprocess = (e) => {
        // Float32(−1 ~ 1) 포맷의 실제 오디오 샘플
        const input = e.inputBuffer.getChannelData(0);

        // 16비트 PCM(Int16)으로 변환
        const pcm16 = float32ToInt16(input);

        // 1) WebSocket이 살아 있으면 서버에 전송
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(pcm16.buffer);
        }

        // 2) 디버그용으로 메모리에 저장
        recordedChunksRef.current.push(pcm16);

        // 통계 업데이트
        setChunkCount((c) => c + 1);
        setTotalBytes((b) => b + pcm16.byteLength);
    };

    // 4. 노드들을 연결하여 콜백 작동시키기
    source.connect(processor);
    processor.connect(audioContext.destination);

    // UI에 “스트리밍 중” 표시
    setIsStreaming(true);
    }, [isStreaming, wsUrl]);


    // stop() - 음성 스트림 종료 (+ 디버그 WAV 생성)
    const stop = useCallback(() => {
        if (!isStreaming) return;

        // 오디오 노드 연결 해제
        sourceRef.current?.disconnect();
        processorRef.current?.disconnect();

        // AudioContext 종료
        audioContextRef.current?.close();

        // WebSocket 종료
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "STOP" }));
        wsRef.current.close();
        }

        // 디버그용 WAV 파일 생성
        const recorded = recordedChunksRef.current;
        if (recorded.length > 0) {
            // 저장된 Int16Array들을 하나로 합치기
            const totalSamples = recorded.reduce((sum, arr) => sum + arr.length, 0);
            const merged = new Int16Array(totalSamples);

            let offset = 0;
            for (const chunk of recorded) {
                merged.set(chunk, offset);
                offset += chunk.length;
        }

            // merged PCM → WAV 파일로 변환 실제로 전달인자는 SAMPLE_RATE
            const wavBuffer = encodeWav(merged, debugSampleRate);

            // 브라우저에서 재생 가능한 Blob URL 생성
            const blob = new Blob([wavBuffer], { type: "audio/wav" });
            const url = URL.createObjectURL(blob);
            setDebugAudioUrl(url);
        }

        // 스트리밍 종료 표시
        setIsStreaming(false);
    }, [isStreaming]);

    // 이 훅이 밖으로 반환하는 기능들
    return {
        start,
        stop,
        isStreaming,

        // 디버그 정보
        chunkCount,
        totalBytes,
        debugAudioUrl,
    };
}

// Float32 배열(브라우저 기본 오디오 형식) → Int16 PCM 변환
function float32ToInt16(float32Array: Float32Array): Int16Array {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
        // -1 ~ 1 범위의 float을 Int16 범위(-32768~32767)로 스케일링
        const s = Math.max(-1, Math.min(1, float32Array[i]));
        int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return int16Array;
}

// pure PCM(Int16Array) → WAV 파일로 변환 (헤더 붙이기)
function encodeWav(samples: Int16Array, sampleRate: number): ArrayBuffer {
    // WAV 파일 포맷: 44byte 헤더 + PCM 데이터
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    // 문자열 쓰기 도우미
    const writeString = (offset: number, str: string) => {
        for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
        }
    };

    const numChannels = 1; // 모노
    const bitsPerSample = 16;

    // WAV 헤더 작성
    writeString(0, "RIFF");
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true); // PCM 고정값
    view.setUint16(20, 1, true);  // 포맷: 1(PCM)
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, (sampleRate * numChannels * bitsPerSample) / 8, true);
    view.setUint16(32, (numChannels * bitsPerSample) / 8, true);
    view.setUint16(34, bitsPerSample, true);
    writeString(36, "data");
    view.setUint32(40, samples.length * 2, true);

    // PCM 샘플 실제 기록
    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
        view.setInt16(offset, samples[i], true);
    }

    return buffer;
}