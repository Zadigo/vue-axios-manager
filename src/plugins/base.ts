import axios from 'axios'
import { reactive } from 'vue'
import { RequestStore, setupAxiosManagerDevtools } from './devtools'
import { checkDomain, createInternalEndpointName, inProduction } from './utils'

import type { Plugin } from 'vue'
import type { EndpointOptions, InternalEnpointOptions, PluginOptions } from './types'

/**
 * Manager that centralizes the different options
 * of the application for different functions
 * @internal
 */
class VueAxiosManager implements VueAxiosManager {
  public pluginOptions: PluginOptions | undefined
  public endpoints: InternalEnpointOptions[] | undefined
  public provideAttr: Record<string, InternalEnpointOptions | undefined>

  constructor() {
    this.pluginOptions = undefined
    this.endpoints = undefined
    this.provideAttr = {}
  }
}

export const vueAxiosManager = new VueAxiosManager()

/**
 * Creates a new axios instance with the provided name
 * @param endpoint Endpoint for which the instance should be create
 * @example
 * ```js
 * const result = createAxiosInstance({ name: 'companies' })
 * console.log(result)
 * { name: "companiesAxios", instance: Axios }
 * ```
 * @internal
 */
export function createAxiosInstance(pluginOptions: PluginOptions, endpoint: EndpointOptions): InternalEnpointOptions {
  // const loc = endpoint.https ? 'https': 'http'
  const loc = endpoint.https ? 'https' : 'http'
  const devDomain = endpoint.dev || `127.0.0.1:${endpoint.port || 8000}`

  checkDomain(devDomain, endpoint)

  let baseDomain: string = `${loc}://${devDomain}`

  if (inProduction()) {
    if (!endpoint.domain) {
      throw new Error(`You need to set domain for "${endpoint.name}" endpoint for production environments`)
    } else {
      baseDomain = endpoint.domain
      checkDomain(baseDomain, endpoint)
    }
  }

  console.log('createAxiosInstance.baseDomain', baseDomain)

  const axiosOptions = pluginOptions.axios || endpoint.axios || {}
  const instance = axios.create({
    baseURL: baseDomain,
    ...axiosOptions
  })

  return {
    ...endpoint,
    internalName: createInternalEndpointName(endpoint.name),
    endpointDomain: baseDomain,
    instance
  }
}

/**
 *
 * @param options Options for the endpoints to create
 */
export function createApiManager(options: PluginOptions): Plugin {
  return {
    install(app) {
      const internalEndpointOptions = options.endpoints.map((endpointOptions) => {
        const result = createAxiosInstance(options, endpointOptions)
        app.config.globalProperties[result.internalName] = result.instance
        return result
      })

      const provideAttr: Record<string, InternalEnpointOptions> = {}
      internalEndpointOptions.forEach((endpoint) => {
        provideAttr[endpoint.name] = endpoint
      })

      vueAxiosManager.provideAttr = provideAttr
      vueAxiosManager.pluginOptions = options
      vueAxiosManager.endpoints = internalEndpointOptions

      app.mixin({
        provide: {
          $axiosEndpoints: reactive(provideAttr)
        }
      })

      if (!inProduction()) {
        window.VueAxiosManager = vueAxiosManager
        setupAxiosManagerDevtools(app)
      }
    }
  }
}
