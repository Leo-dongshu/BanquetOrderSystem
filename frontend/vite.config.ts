import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    target: 'es2015',
    chunkSizeWarningLimit: 1500,
    reportCompressedSize: false,  // 跳过 gzip 计算，加快构建
  }
})
