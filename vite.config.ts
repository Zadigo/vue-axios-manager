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
      copyDtsFiles: false
    }),
    eslint()
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/lib/index.ts'),
      name: 'VueAxiosManager',
      fileName: format => `vue-axios-manager-${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'axios'],
      output: {
        globals: { vue: 'Vue', axios: 'axios' }
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
