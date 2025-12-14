// src/styles/GlobalStyle.ts
import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
    @font-face {
        font-family: "KoddiUD OnGothic";
        src: url("/fonts/KoddiUDOnGothic-Regular.ttf") format("truetype");
        font-weight: 400;
        font-style: normal;
        font-display: swap; /* 폰트 로딩 지연 시 시스템 폰트로 먼저 표시 */
    }

    @font-face {
        font-family: "KoddiUD OnGothic";
        src: url("/fonts/KoddiUDOnGothic-Bold.ttf") format("truetype");
        font-weight: 700;
        font-style: normal;
        font-display: swap;
    }

    @font-face {
        font-family: "KoddiUD OnGothic";
        src: url("/fonts/KoddiUDOnGothic-ExtraBold.ttf") format("truetype");
        font-weight: 800;
        font-style: normal;
        font-display: swap;
    }

    :root {
        --font-scale: 1; /* 1 = 기본, 1.3 = 크게 등 */
    }

    html {
        font-size: calc(16px * var(--font-scale));
    }

    *, *::before, *::after {
        box-sizing: border-box;
    }

    html, body, #root {
        height: 100%;
    }

    body {
        margin: 0;
        display: flex;
        justify-content: center;  /* 수평 중앙 */
        background: #fff;         /* 배경 */
        color: #111;
        font-family: "KoddiUD OnGothic",system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', sans-serif;
    }

    /* ── 5) 사용자 모션 선호 존중 ── */
    @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
            animation: none !important;
            transition: none !important;
        }
    }
`
