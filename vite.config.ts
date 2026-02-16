import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss()
  ],
  server: {
    allowedHosts: ['vizedge-pds-dev.tbsbest.com'],
  },
  base: process.env.NODE_ENV === 'production' ? '/app/cnn/generic' : '/',
  build: {
    outDir: 'cnn/generic',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
