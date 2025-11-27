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
      // Set default values for missing endpoint options
      options.endpoints.forEach((endpointOptions) => {
        if (!endpointOptions.refreshEndpoint) {
          endpointOptions.refreshEndpoint = '/v1/token/refresh/'
        }

        if (!endpointOptions.accessEndpoint) {
          endpointOptions.accessEndpoint = '/v1/token/'
        }

        if (!endpointOptions.verifyEndpoint) {
          endpointOptions.verifyEndpoint = '/v1/token/verify/'
        }

        if (!endpointOptions.dev) {
          endpointOptions.dev = '127.0.0.1'
        }

        if (!endpointOptions.port) {
          endpointOptions.port = '8000'
        }

        if (typeof endpointOptions.verifyToken === 'undefined') {
          endpointOptions.verifyToken = true
        }
      })

      // console.log('Initializing Vue Axios Manager with options:', options)

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
