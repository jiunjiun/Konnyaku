import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { crx } from '@crxjs/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import manifest from './manifest.config.mjs'
import resolve from './config/vite/resolve_alias.js'

export default defineConfig({
  resolve,
  plugins: [vue(), crx({ manifest }), tailwindcss()]
})