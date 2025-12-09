// src/pages/VoiceDebugPage.tsx

import { usePcmStream } from "lib/audio/usePcmStream";

export default function VoiceDebugPage() {
  const {
    start,
    stop,
    isStreaming,
    chunkCount,
    totalBytes,
    debugAudioUrl,
  } = usePcmStream();

  const handleSendToTestApi = async () => {
    if (!debugAudioUrl) {
      alert("먼저 녹음을 종료해서 WAV를 생성해주세요.");
      return;
    }

    const rawToken = localStorage.getItem("accessToken");
    if (!rawToken) {
      alert("accessToken이 없습니다. 로그인 후 다시 시도하세요.");
      return;
    }

    try {
      // 1) debugAudioUrl → Blob으로 가져오기
      const wavRes = await fetch(debugAudioUrl);
      const wavBlob = await wavRes.blob();

      // 2) FormData 구성
      const formData = new FormData();
      formData.append("file", wavBlob, "voice.wav"); // key 이름이 스펙 상 "file"

      // 3) /test/voice로 POST
      const res = await fetch("http://43.200.235.175:8080/test/voice", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${rawToken.trim()}`,
          // ⚠️ form-data에서는 Content-Type을 직접 지정하지 말고 FormData에 맡겨야 함
        },
        body: formData,
      });

      const text = await res.text(); // 백에서 JSON이면 JSON.parse 해도 됨
      console.log("✅ /test/voice 응답:", res.status, text);

      if (!res.ok) {
        alert(`실패: ${res.status}\n${text}`);
      } else {
        alert(`성공: ${text}`);
      }
    } catch (err) {
      console.error("❌ /test/voice 호출 중 에러:", err);
      alert("요청 중 에러가 발생했습니다. 콘솔 로그를 확인하세요.");
    }
  };

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "22px", marginBottom: "12px" }}>
        🎤 음성 스트리밍 디버그 페이지
      </h1>

      <button
        onClick={isStreaming ? stop : start}
        style={{
          padding: "10px 16px",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: "pointer",
          background: isStreaming ? "#ff5e5e" : "#4caf50",
          color: "white",
          border: "none",
        }}
      >
        {isStreaming ? "🛑 중지" : "▶️ 시작"}
      </button>

      <div style={{ marginTop: "20px", lineHeight: "1.6" }}>
        <p>
          <strong>상태:</strong>{" "}
          {isStreaming ? "⏺️ 스트리밍 중..." : "⏹️ 중지됨"}
        </p>
        <p>
          <strong>보낸 청크 수:</strong> {chunkCount}
        </p>
        <p>
          <strong>보낸 총 바이트 수:</strong> {totalBytes} bytes
        </p>
      </div>

      {debugAudioUrl && (
        <div style={{ marginTop: "24px" }}>
          <h2 style={{ fontSize: "18px" }}>🎧 마지막 녹음 재생</h2>
          <audio
            controls
            src={debugAudioUrl}
            style={{ marginTop: "8px", width: "100%" }}
          />
          <p style={{ fontSize: "14px", color: "#666" }}>
            ※ PCM → WAV 변환이 잘 됐는지 확인 후, 아래 버튼으로 STT 서버에 테스트 전송
          </p>

          {/* ⬇ 여기서 /test/voice로 전송 */}
          <button
            onClick={handleSendToTestApi}
            style={{
              marginTop: "12px",
              padding: "8px 14px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background: "#1976d2",
              color: "#fff",
            }}
          >
            📤 이 WAV를 /test/voice로 보내기
          </button>
        </div>
      )}
    </div>
  );
}
