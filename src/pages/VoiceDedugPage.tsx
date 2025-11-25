import { usePcmStream } from "lib/audio/usePcmStream";

export default function VoiceDebugPage() {

    // usePcmStream 훅에서 필요한 값들 가지고 오기
    const {
        start, // 스트리밍 시작
        stop, //스트리밍 중지
        isStreaming, // 지금 스트리밍 중인지 true/false
        chunkCount, // 보낸 PCM chunk의 수
        totalBytes, // 지금까지 보낸 총 바이트 수
        debugAudioUrl, // stop 눌렀을 때 만들어지는 WAV 파일 URL
    } = usePcmStream();
    // 추후 WebSocket 서버 주소 env 파일 넣고 여기에도 넣기

    return (
        <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
        <h1 style={{ fontSize: "22px", marginBottom: "12px" }}>
            🎤 음성 스트리밍 디버그 페이지
        </h1>

        {/* ---------------------------- */}
        {/* 녹음 시작/중지 버튼 */}
        {/* ---------------------------- */}
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

        {/* ---------------------------- */}
        {/* 실시간 디버그 정보 */}
        {/* ---------------------------- */}
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

        {/* ---------------------------- */}
        {/* WAV 재생 영역 */}
        {/* (stop() 실행 후에만 생성됨) */}
        {/* ---------------------------- */}
        {debugAudioUrl && (
            <div style={{ marginTop: "24px" }}>
            <h2 style={{ fontSize: "18px" }}>🎧 마지막 녹음 재생</h2>
            <audio
                controls
                src={debugAudioUrl}
                style={{ marginTop: "8px", width: "100%" }}
            />
            <p style={{ fontSize: "14px", color: "#666" }}>
                ※ 방금 말한 음성이 정상 PCM → WAV로 저장되었는지 확인 가능
            </p>
            </div>
        )}
        </div>
    );
}