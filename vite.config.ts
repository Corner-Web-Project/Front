import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 로컬 개발: /api 요청을 Back으로 전달 (운영은 netlify.toml 프록시)
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
