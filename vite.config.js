import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // cloudflared tunnel ve benzeri tünel araçları için (host her seferinde değişir)
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost/ledapi',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
