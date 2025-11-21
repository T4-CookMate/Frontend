import { create } from "zustand";

type A11ystate = {
    fontScale: number; // 1 = 기본, 1.3 = 크게
    setFontScale: (v: number) => void; // 임의로 배율 설정
    toggleLarge: () => void; // 기본 <-> 크게 토글
}

// 로컬스토리지 키 이름 (사용자 설정 유지)
const STORAGE_KEY = "a11y_font_scale";

export const useA11yStore = create<A11ystate>((set, get) => ({
    // 초기값: 로컬스토리지에 저장된 값이 있으면 가져오고, 없으면 1
    fontScale: Number(localStorage.getItem(STORAGE_KEY)) || 1,

    // 배율 수동 설정 (다른 단계로 확장 가능 ???)
    setFontScale: (v) => {
        localStorage.setItem(STORAGE_KEY, String(v)); // 브라우저에 저장
        set({ fontScale: v });
    },

    // 버튼 클릭 시 토글
    toggleLarge: () => {
        const next = get().fontScale === 1 ? 1.3 : 1;
        localStorage.setItem(STORAGE_KEY, String(next));
        set({ fontScale: next });
    },
}))