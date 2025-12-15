import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite';
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
  ],
  base: process.env.NODE_ENV === 'production' ? '/low-code-common/' : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  server: {
    proxy: {
      // 代理所有/api开头的请求到指定的APIfox地址
      '/apifox': {
        target: 'https://s.apifox.cn',
        changeOrigin: true,
        rewrite: (pathUrl) => pathUrl.replace(/^\/apifox/, ''),
        secure: false // 允许非https代理
      }
    }
  },
  esbuild: {
    sourcemap: true,
    sourceRoot: '/src',
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'pinia'],
          utils: ['uuid', 'sortablejs']
        }
      }
    }
  }
})
