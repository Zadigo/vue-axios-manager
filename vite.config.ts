import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import path from 'path'
import eslint from 'vite-plugin-eslint'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      copyDtsFiles: true,
      include: ['src/lib/**/*'],
      exclude: [
        'src/lib/**/*.test.*',
        'src/lib/**/*.spec.*',
        'src/lib/**/*.stories.*',
        '**/*.config.*',
        '**/vite.config.*',
        '**/eslint.config.*',
        '**/vitest.config.*',
        'node_modules/**',
        'dist/**'
      ],
      outDir: 'dist',
      entryRoot: 'src/lib/index.ts',
      // rollupTypes: true
    }),
    eslint()
  ],
  build: {
    sourcemap: true,
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'src/lib/index.ts'),
      name: 'VueAxiosManager',
      formats: ['es', 'umd'],
      fileName: format => `vue-axios-manager.${format === 'es' ? 'es.js' : 'umd.cjs'}`
    },
    rollupOptions: {
      external: ['vue', 'axios', '@vueuse/core', '@vueuse/integrations', 'universal-cookie'],
      output: {
        globals: {
          'vue': 'Vue',
          'axios': 'axios',
          '@vueuse/core': 'VueUseCore',
          '@vueuse/integrations': 'VueUseIntegrations',
          'universal-cookie': 'UniversalCookie'
        }
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
