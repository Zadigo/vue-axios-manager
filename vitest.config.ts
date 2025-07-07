import vue from '@vitejs/plugin-vue'
import path from 'path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    vue()
  ],
  test: {
    include: ['tests/**/*.{spec}.ts'],
    coverage: {
      enabled: true
    },
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
