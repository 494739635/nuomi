import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages serves this project below /nuomi/; local development stays at /.
  base: process.env.GITHUB_ACTIONS ? '/nuomi/' : '/',
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 4173,
  },
})
