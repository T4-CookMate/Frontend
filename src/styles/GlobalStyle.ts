// src/styles/GlobalStyle.ts
import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
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
        font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', sans-serif;
    }
`
