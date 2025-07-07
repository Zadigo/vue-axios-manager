import axios from 'axios'
import { reactive } from 'vue'
import { setupAxiosManagerDevtools, RequestStore } from './devtools'

import type { Plugin } from 'vue'
import type { Endpoints, InternalEnpoints, PluginOptions } from './types'

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
export function createAxiosInstance(endpoint: Endpoints): InternalEnpoints {
  // const loc = endpoint.https ? 'https': 'http'
  const devDomain = endpoint.dev || '127.0.0.1'
  const port = endpoint.port || '8000'

  let baseDomain: string = `http://${devDomain}:${port}`

  if (inProduction()) {
    if (!endpoint.domain) {
      throw new Error(`You need to set domain for "${endpoint.name}" endpoint for production environments`)
    } else {
      baseDomain = endpoint.domain
    }
  }

  const instance = axios.create({
    baseURL: baseDomain,
    headers: { 'Content-Type': 'application/json' },
    timeout: 20000,
    withCredentials: true
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
        const result = createAxiosInstance(endpointOptions)
        app.config.globalProperties[result.internalName] = result.instance
        return result
      })

      const provideAttr: Record<string, InternalEnpoints> = {}
      internalEndpointOptions.forEach((endpoint) => {
        provideAttr[endpoint.name] = endpoint
      })

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
