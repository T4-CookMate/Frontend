export async function unlockAudioOnce() {
  try {
    const a = new Audio("/sounds/danger1.mp3");
    a.volume = 0;
    await a.play();
    a.pause();
    a.currentTime = 0;
    a.volume = 1;
  } catch {
    // 자동재생 정책 때문에 실패할 수도 있음(무시)
  }
}
