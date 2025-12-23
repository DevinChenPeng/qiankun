import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'

export default defineConfig({
  plugins: [
    vue(),
    qiankun('micro-app1', {
      useDevMode: true
    })
  ],
  server: {
    port: 8081,
    cors: true,
    origin: 'http://localhost:8081'
  },
  base: '/'
})
