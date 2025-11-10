import { create } from 'zustand'

type UIState = {
  voiceMode: boolean        // 음성 안내 모드
  cookingStep: number       // 현재 단계
}
type UIActions = {
    setVoiceMode: (on: boolean) => void
    nextStep: () => void
    resetStep: () => void
}
export const useAppStore = create<UIState & UIActions>((set) => ({
    voiceMode: false,
    cookingStep: 0,
    setVoiceMode: (on) => set({ voiceMode: on }),
    nextStep: () => set((s) => ({ cookingStep: s.cookingStep + 1 })),
    resetStep: () => set({ cookingStep: 0 }),
}))
