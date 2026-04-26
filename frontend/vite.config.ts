import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [vue()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_PROXY_TARGET || 'http://localhost:8082',
          changeOrigin: true
        }
      }
    },
    build: {
      target: 'es2015',
      chunkSizeWarningLimit: 1500,
      reportCompressedSize: false,  // 跳过 gzip 计算，加快构建
    }
  }
})
