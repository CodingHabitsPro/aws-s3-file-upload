import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // string shorthand
      '/api': 'https://aws-s3-post-upload.up.railway.app/',
    }
  }
})
