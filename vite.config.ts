import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import path from 'path'
import eslint from 'vite-plugin-eslint'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    eslint()
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/plugins/index.ts'),
      name: 'Vue Axios Manager',
      fileName: format => `vue-axios-manager-${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' }
      }
    }
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src')
      }
    ]
  }
})
