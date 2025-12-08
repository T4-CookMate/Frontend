// src/components/TtsTestButton.tsx
import React from "react";
import { speak } from "../utils/speech";

const TtsTestButton: React.FC = () => {
  const handleClick = () => {
    const text = "쌀을 먼저 씻고, 물을 1컵 붓고, 조심해서 전기밥솥에 넣어 주세요.";
    speak(text);
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: "8px 16px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
      }}
    >
      🔊 TTS 테스트
    </button>
  );
};

export default TtsTestButton;
