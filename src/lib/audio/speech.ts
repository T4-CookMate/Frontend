// src/lib/audio/speech.ts
export async function speak(text: string) {
  const endpoint =
    "https://cookmate-speech.services.ai.azure.com/";
  const apiKey = import.meta.env.VITE_AZURE_SPEECH_KEY;

  // 0) 키가 제대로 들어왔는지부터 확인
  if (!apiKey) {
    console.error("❌ VITE_AZURE_SPEECH_KEY 가 비어 있습니다.");
    alert("TTS 키가 설정되지 않았어요. .env 를 다시 확인해줘!");
    return;
  }

  const ssml = `
    <speak version="1.0" xml:lang="ko-KR">
      <voice xml:lang="ko-KR" xml:gender="Female" name="ko-KR-SunHiNeural">
        ${text}
      </voice>
    </speak>
  `.trim();

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/ssml+xml",
        "Ocp-Apim-Subscription-Key": apiKey,
        "X-Microsoft-OutputFormat": "audio-16khz-32kbitrate-mono-mp3",
      },
      body: ssml,
    });

    console.log("🔊 TTS 응답 코드:", res.status);

    if (!res.ok) {
      const errText = await res.text();
      console.error("❌ TTS 실패:", res.status, errText);
      alert(`TTS 호출 실패: ${res.status}`);
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);

    audio.onplay = () => console.log("▶️ 오디오 재생 시작");
    audio.onerror = (e) => console.error("🎧 오디오 재생 에러", e);

    audio.play();
  } catch (e) {
    console.error("🌐 TTS 네트워크 오류:", e);
    alert("TTS 네트워크 오류 발생! 콘솔을 확인해줘.");
  }
}
