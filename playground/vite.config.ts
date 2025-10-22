import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import { compilerOptions } from '../tsconfig.json'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const resolvePaths = () => {
  return Object.fromEntries(
    Object.entries(compilerOptions.paths || {}).map(([key, value]) => [
      key.replace('/*', ''),
      resolve(__dirname, '..', value[0].replace('/*', ''))
    ])
  )
}

function createVueAxiosManagerPluginOption(enableLogging?: boolean, mockApi?: boolean, apiBaseUrl?: string): Plugin {
  return {
    name: 'vite:vue-axios-manager',
    config() {
      return {
        optimizeDeps: {
          include: ['axios']
        }
      }
    },
    configureServer(_server) {},
    buildStart() {
      if (enableLogging) {
        console.log('🔧 Vue Axios Manager plugin initialized')
        if (mockApi) {
          console.log(`📡 Mock API enabled at ${apiBaseUrl}`)
        }
      }
    }
  }
}

export default defineConfig({
  root: resolve(__dirname, './'),
  plugins: [
    vue(),
    createVueAxiosManagerPluginOption()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      ...resolvePaths()
    },
    extensions: ['.ts', '.tsx', '.js', '.json']
  }
})
