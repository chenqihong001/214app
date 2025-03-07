import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // 监听所有网络接口
    port: 5173,       // 可选：指定端口（默认 5173）
    strictPort: true, // 如果端口被占用直接退出
  }
})
