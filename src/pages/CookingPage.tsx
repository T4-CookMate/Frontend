// src/pages/CookingPage.tsx

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePcmStream } from "lib/audio/usePcmStream";
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

  // 1️⃣ 토큰
  const rawToken = localStorage.getItem("accessToken");
  const token = rawToken?.trim() || null;

  // 2️⃣ 음성 WS URL
  const voiceWsUrl = useMemo(() => {
    if (!recipeId || !token) return undefined;
    return `ws://43.200.235.175:8080/ws/voice?recipeId=${recipeId}&token=${encodeURIComponent(
      token
    )}`;
  }, [recipeId, token]);

  // 3️⃣ 비전 WS URL
  const visionWsUrl = useMemo(() => {
    if (!recipeId || !token) return undefined;
    return `ws://54.180.165.255/ws/vision?recipeId=${recipeId}&accessToken=${encodeURIComponent(
      token
    )}`;
  }, [recipeId, token]);

  // 4️⃣ 음성 스트리밍 훅
  const { start: startVoice, stop: stopVoice } = usePcmStream(voiceWsUrl);

  // 5️⃣ 비전 스트리밍 훅
  const { start: startVision, stop: stopVision } =
    useVideoFrameStream(visionWsUrl, videoRef, 5);

  // 6️⃣ 잘못 진입 방어
  useEffect(() => {
    if (!recipeId) {
      alert("레시피 정보가 없습니다.");
      navigate("/search");
      return;
    }
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [recipeId, token, navigate]);

  // 7️⃣ 카메라 ON (페이지 진입 즉시)
  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (cancelled) return;
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        console.error("카메라 권한 실패", err);
        alert("카메라 권한이 필요합니다.");
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 8️⃣ 음성 WS 자동 시작
  useEffect(() => {
    if (!voiceWsUrl) return;
    startVoice();
    return () => stopVoice();
  }, [voiceWsUrl]);

  // 9️⃣ 비전 WS 자동 시작 (비디오 준비된 뒤)
  useEffect(() => {
    const video = videoRef.current;
    if (!visionWsUrl || !video) return;

    const onReady = () => {
      startVision();
    };

    if (video.readyState >= 2) {
      startVision();
    } else {
      video.addEventListener("loadedmetadata", onReady);
    }

    return () => {
      video.removeEventListener("loadedmetadata", onReady);
      stopVision();
    };
  }, [visionWsUrl]);

  return (
    <div
      style={{
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        height: "100vh",
        boxSizing: "border-box",
      }}
    >
      <button onClick={() => navigate(-1)}>← 뒤로</button>

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
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* 상태 텍스트 (접근성용, 디버그 겸) */}
      <p style={{ fontSize: 14, opacity: 0.8 }}>
        🎤 음성 안내 중 · 🎥 위험 감지 중
      </p>
    </div>
  );
}
