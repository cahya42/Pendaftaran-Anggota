import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  // Cache Vite di drive C agar dev/build tetap jalan walau drive D penuh
  cacheDir: 'C:/tjokro-vite-cache',
  server: {
    port: 5173,
    open: true,
  },
})
