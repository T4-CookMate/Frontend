import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
    *, *::before, *::after { box-sizing: border-box; }
    html, body, #root { height: 100%; }
    body { margin: 0; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', sans-serif; }
    button { cursor: pointer; }
`
