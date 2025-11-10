import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// 경로 별칭 플러그인
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
})
