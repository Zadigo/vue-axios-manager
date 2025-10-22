import type { Plugin } from 'vue'
import { markRaw } from 'vue'
// import { setupAxiosManagerDevtools } from './devtools'
import { vueAxiosManager } from './manager'
import type { PluginOptions } from './types'
import { inProduction } from './utils'

/**
 *
 * @param options Options for the endpoints to create
 */
export function createVueAxiosManager(options: PluginOptions): Plugin {
  return {
    install(app) {
      vueAxiosManager.initialize(app, options)

      app.mixin({
        provide: {
          $axiosManager: markRaw(vueAxiosManager)
        }
      })

      if (!inProduction()) {
        // window.VueAxiosManager = vueAxiosManager
        // setupAxiosManagerDevtools(app)
      }
    }
  }
}
