import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  cacheDir: 'node_modules/.vite-zulanex-client',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://z-server-ofdw.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
