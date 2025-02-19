import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 改为true，自动处理IP绑定
    port: 3000, // 改用更常用的端口
    strictPort: true, // 如果端口被占用则报错
    hmr: {
      overlay: false // 禁用错误覆盖层
    }
  },
  preview: {
    allowedHosts: [
      'ysloaner-markdown-editor.onrender.com'
    ],
    host: true,
    port: 3000,
    strictPort: true
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})
