// lib/video/useVideoFrameStream.ts
import { useCallback, useRef, useState } from "react";
import type { RefObject } from "react";

// import danger1 from "../../assets/error-v1.mp3";
// // import danger2 from "@/assets/danger2.mp3";

//   const audioMap: Record<string, string> = {
//     KNIFE: danger1,
//     // FIRE: danger2,
//   };

import dangerKnife from "../../assets/error-v1.mp3";
import dangerFire from "../../assets/error-v1.mp3"; // 수정예정

const audioMapByCode: Record<string, string> = {
  danger_knife: dangerKnife,
  danger_fire: dangerFire,
};



export function useVideoFrameStream(
  wsUrl: string | undefined,
  videoRef: RefObject<HTMLVideoElement | null>,
  fps: number = 1
) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [frameCount, setFrameCount] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<number | null>(null);

  // 화면 캡처용 캔버스 (화면에는 안 보이고 메모리에서만 사용)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const isSendingRef = useRef(false);

  // const playAlert = useCallback((kind: keyof typeof audioMap) => {
  //   const src = audioMap[kind] ?? audioMap.KNIFE;
  //   const a = new Audio(src);
  //   a.play().catch((e) => console.warn("오디오 재생 실패:", e));
  // }, []);


  // 주기적으로 프레임 캡처해서 보내는 함수
  const startFrameLoop = useCallback(() => {
    if (timerRef.current) return;
    if (!fps || fps <= 0) return;

    const interval = 1000 / fps;

    const sendFrame = async () => {
      const video = videoRef.current;
      const ws = wsRef.current;

      if (!video || !ws || ws.readyState !== WebSocket.OPEN) return;

      // (중요) 이전 프레임 처리 중이면 스킵
      if (isSendingRef.current) return;

      // (중요) WS 버퍼가 너무 쌓였으면 스킵 (예: 2MB)
      if (ws.bufferedAmount > 2 * 1024 * 1024) return;

      // 비디오가 아직 준비 안됐으면 스킵
      const width = video.videoWidth;
      const height = video.videoHeight;
      if (!width || !height) return;

      // 캔버스 준비
      if (!canvasRef.current) {
        canvasRef.current = document.createElement("canvas");
      }
      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 현재 비디오 화면을 캔버스에 그리기
      ctx.drawImage(video, 0, 0, width, height);

      // 캔버스를 JPEG 이미지(Blob)로 변환
      canvas.toBlob(
        async (blob) => {
          if (!blob) return;
          const buffer = await blob.arrayBuffer();
          ws.send(buffer); // ← 한 장의 JPEG 이미지를 그대로 전송
          console.log("📤 frame bytes:", buffer.byteLength);
          setFrameCount((c) => c + 1);
        },
        "image/jpeg",
        0.7 // 압축 품질 (0~1)
      );
    };

    const id = window.setInterval(sendFrame, interval);
    timerRef.current = id;
  }, [fps, videoRef]);

  const stopFrameLoop = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 스트리밍 시작
  const start = useCallback(() => {
    if (isStreaming) return;
    if (!wsUrl) {
      console.warn("video wsUrl 없음");
      return;
    }

    const ws = new WebSocket(wsUrl);
    ws.binaryType = "arraybuffer";
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("🎥 Video WebSocket connected");
      // // (선택) 서버에 메타 정보 전달
      // ws.send(
      //   JSON.stringify({
      //     type: "START",
      //     format: "jpeg",
      //     fps,
      //   })
      // );

      setFrameCount(0);
      startFrameLoop();
      setIsStreaming(true);
    };

    // 경고음
    ws.onmessage = (evt) => {
    try {
      const data = typeof evt.data === "string" ? JSON.parse(evt.data) : null;

      if (data?.type === "DANGER") {
        const code = String(data.code ?? "").toLowerCase(); // "danger_fire"
        const src = audioMapByCode[code] ?? audioMapByCode["danger_knife"];

        const a = new Audio(src);
        a.play().catch((e) => console.warn("오디오 재생 실패:", e));
      }
    } catch (e) {
      console.warn("DANGER 메시지 파싱 실패:", e);
    }
  };


    ws.onerror = (e) => {
      console.error("Video WebSocket error", e);
    };

    ws.onclose = () => {
      console.log("🎥 Video WebSocket closed");
      stopFrameLoop();
      setIsStreaming(false);
    };
  }, [fps, isStreaming, startFrameLoop, stopFrameLoop, wsUrl]);


  // 스트리밍 중지
  const stop = useCallback(() => {
    if (!isStreaming) return;

    stopFrameLoop();

    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "STOP" }));
      ws.close();
    }

    setIsStreaming(false);
  }, [isStreaming, stopFrameLoop]);

  return {
    start,
    stop,
    isStreaming,
    frameCount,
  };
}
