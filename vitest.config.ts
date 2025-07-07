import vue from '@vitejs/plugin-vue'
import path from 'path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    vue()
  ],
  test: {
    include: ['**/*.{spec,test}.ts'],
    coverage: {
      enabled: true
    },
    setupFiles: 'tests/vitest.setup.ts',
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
