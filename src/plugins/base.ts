import axios from 'axios'
import { reactive } from 'vue'
import { setupAxiosManagerDevtools, RequestStore } from './devtools'

import type { Plugin } from 'vue'
import type { Endpoints, InternalEnpoints, PluginOptions } from './types'

/**
 * Manager that centralizes the different options
 * of the application for different functions
 * @internal
 */
class VueAxiosManager implements VueAxiosManager {
  public pluginOptions: PluginOptions | undefined
  public endpoints: InternalEnpoints[] | undefined
  public provideAttr: Record<string, InternalEnpoints | undefined>

  constructor() {
    this.pluginOptions = undefined
    this.endpoints = undefined
    this.provideAttr = {}
  }
}

export const vueAxiosManager = new VueAxiosManager()

/**
 * Checks whether the application in prodcution
 */
export function inProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/**
 * Creates an internal name for the endpoint
 * @param name The endpoint name
 * @example "$endpointAxios"
 * @internal
 */
export function createInternalEndpointName(name: string) {
  return `$${name}Axios`
}

/**
 * Helper function used to check that the domain does not
 * have a protocol (http, https) and does not have a host
 * @param domain The domain to check
 * @param endpoint The endpoint configuration options
 * @internal
 */
function checkDomain(domain: string, endpoint: Endpoints) {
  if (domain.startsWith('http')) {
    throw new Error(`Endpoint "${endpoint.name}" should not start with "http" or "https"`)
  }
}

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
export function createAxiosInstance(pluginOptions: PluginOptions, endpoint: Endpoints): InternalEnpoints {
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

      const provideAttr: Record<string, InternalEnpoints> = {}
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
        const store = new RequestStore(app, options, internalEndpointOptions)

        app.provide('requestStore', store)
        setupAxiosManagerDevtools(app, store)
      }
    }
  }
}
