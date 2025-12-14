// src/pages/CookingPage.tsx

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePcmStream } from "lib/audio/usePcmStream";
import TtsTestButton from "@components/TtsTestButton";
import { useVideoFrameStream } from "lib/video/useVideoFrameStream";


type LocationState = {
  recipeId: number;
  recipeName: string;
};

export default function CookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const recipeId = state?.recipeId;
  const recipeName = state?.recipeName ?? "요리";

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [debugFrameUrl, setDebugFrameUrl] = useState<string | null>(null);

  // 1) 토큰 읽기
  const rawToken = localStorage.getItem("accessToken");
  const token = rawToken?.trim() || null;

  // 2) 음성 WebSocket URL 만들기
  const wsUrl = useMemo(() => {
    if (!recipeId || !token) return undefined;
    return `ws://43.200.235.175:8080/ws/voice?recipeId=${recipeId}&token=${encodeURIComponent(
      token
    )}`;
  }, [recipeId, token]);

  // 비전서버 웹소켓 연결
  const visionWsUrl = useMemo(() => {
    if (!recipeId || !token) return undefined;
    return `ws://54.180.165.255/ws/vision?recipeId=${recipeId}&accessToken=${encodeURIComponent(token)}`;
  }, [recipeId, token]);


  // 3) PCM 스트림 훅 (wsUrl을 넘기면 훅 내부에서 WebSocket 열고 PCM 전송)
  const {
    start,
    stop,
    isStreaming,
    chunkCount,
    totalBytes,
    debugAudioUrl,
  } = usePcmStream(wsUrl);

  // 비전 서버 훅 호출
  const {
    start: startVision,
    stop: stopVision,
    isStreaming: isVisionStreaming,
    frameCount: visionFrameCount,
  } = useVideoFrameStream(visionWsUrl, videoRef, 1); // fps 1은 예시


  // 4) 잘못 진입했을 때 처리 (레시피 X / 토큰 X)
  useEffect(() => {
    if (!recipeId) {
      alert("레시피 정보가 없습니다. 다시 검색 화면에서 진입해주세요.");
      navigate("/search");
      return;
    }
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
  }, [recipeId, token, navigate]);

  // 5) 카메라 켜기 (영상만; 마이크는 usePcmStream에서 따로 켬)
  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false, // 마이크는 usePcmStream에서 처리
        });
        if (cancelled) return;
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        console.error("카메라 권한 요청 실패", err);
        alert("카메라 권한이 필요합니다.");
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 최초 1번만 실행

  const handleBack = () => {
    navigate(-1);
  };

  const handleToggleStream = () => {
    if (isStreaming) {
      stop();
    } else {
      start();
    }
  };

  const handleCaptureFrame = async () => {
    const video = videoRef.current;
    if (!video) {
      alert("비디오가 아직 준비되지 않았어요!");
      return;
    }

    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) {
      alert("영상 로딩이 아직 안 끝난 것 같아요.");
      return;
    }

    // 캔버스 준비 (없으면 만들기)
    let canvas = canvasRef.current;
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvasRef.current = canvas;
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 현재 비디오 화면을 캔버스에 그리기
    ctx.drawImage(video, 0, 0, width, height);

    // 캔버스를 data URL (이미지 주소)로 변환
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    setDebugFrameUrl(dataUrl);
  };


  return (
    <div
      style={{
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        height: "100vh",
        boxSizing: "border-box",
      }}
    >
      <button onClick={handleBack}>← 뒤로</button>

      <h2>{recipeName} 요리 중</h2>

      {/* 카메라 영상 */}
      <div
        style={{
          flex: 1,
          borderRadius: 16,
          overflow: "hidden",
          background: "#000",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted // 에코 방지
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* 음성 스트리밍 버튼 (지금은 수동, 나중에 자동 start() 해도 됨) */}
      <button
        onClick={handleToggleStream}
        style={{
          padding: "10px 16px",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: "pointer",
          background: isStreaming ? "#ff5e5e" : "#4caf50",
          color: "white",
          border: "none",
        }}
        disabled={!wsUrl} // 레시피/토큰 없으면 비활성화
      >
        {isStreaming ? "🛑 음성 스트리밍 중지" : "▶️ 음성 스트리밍 시작"}
      </button>

      {/* 상태 표시 */}
      <div>
        <p>카메라 상태: {stream ? "ON 🎥" : "OFF"}</p>
        <p>보낸 청크 수: {chunkCount}</p>
        <p>보낸 총 바이트: {totalBytes} bytes</p>
      </div>

      {/* 디버그용: 마지막 WAV 재생 (필요 없으면 나중에 삭제) */}
      {debugAudioUrl && (
        <div>
          <h3>🎧 마지막 녹음 재생 (디버그용)</h3>
          <audio controls src={debugAudioUrl} />
        </div>
      )}

      <button
        onClick={handleCaptureFrame}
        style={{
          padding: "8px 12px",
          borderRadius: "8px",
          fontSize: "14px",
          cursor: "pointer",
          background: "#1976d2",
          color: "white",
          border: "none",
          marginTop: "8px",
        }}
      >
        📸 현재 프레임 캡처 (디버그)
      </button>

      {debugFrameUrl && (
        <div style={{ marginTop: 12 }}>
          <p>캡처된 프레임 미리보기:</p>
          <img
            src={debugFrameUrl}
            alt="captured frame"
            style={{ width: "100%", maxHeight: 300, objectFit: "contain" }}
          />
        </div>
      )}

      <button
        onClick={() => (isVisionStreaming ? stopVision() : startVision())}
        disabled={!visionWsUrl}
        style={{
          padding: "10px 16px",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: "pointer",
          background: isVisionStreaming ? "#ff5e5e" : "#4caf50",
          color: "white",
          border: "none",
        }}
      >
        {isVisionStreaming ? "🛑 영상 스트리밍 중지" : "▶️ 영상 스트리밍 시작"}
      </button>

      <p>보낸 프레임 수: {visionFrameCount}</p>


      <TtsTestButton />
    </div>
  );
}
