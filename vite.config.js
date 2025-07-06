import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { copyFileSync, mkdirSync } from 'fs'

export default defineConfig({
  plugins: [
    vue(), 
    tailwindcss(),
    {
      name: 'copy-manifest',
      writeBundle() {
        // 確保 dist 目錄存在
        mkdirSync('dist', { recursive: true })
        // 在建置結束時複製 manifest.json
        copyFileSync('manifest.json', 'dist/manifest.json')
        // 複製 content.css
        copyFileSync('src/content.css', 'dist/content.css')
      }
    }
  ],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        options: resolve(__dirname, 'options.html'),
        background: resolve(__dirname, 'src/background.js'),
        content: resolve(__dirname, 'src/content.js')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
})