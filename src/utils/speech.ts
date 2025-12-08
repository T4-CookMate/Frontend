// src/utils/speech.ts
export function speak(text: string) {
  if (!("speechSynthesis" in window)) {
    console.warn("이 브라우저는 SpeechSynthesis를 지원하지 않아요.");
    return;
  }

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ko-KR"; // 한국어
  utter.rate = 1.0;     // 말하는 속도
  utter.pitch = 1.0;    // 톤

  // 이미 말하고 있는 중이면 멈추고 새로 시작
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}
