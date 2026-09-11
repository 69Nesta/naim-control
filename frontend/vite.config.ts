import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/ws': { target: `${process.env.VITE_BACKEND_WS || 'ws://localhost:3000'}`, ws: true },
      '/api': process.env.VITE_BACKEND_URL || 'http://localhost:3000',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
