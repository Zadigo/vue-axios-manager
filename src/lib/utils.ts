import axios from 'axios'
import type { EndpointOptions } from './types'

import type { InternalEnpointOptions, PluginOptions } from './types'

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
export function checkDomain(domain: string, endpoint: EndpointOptions) {
  if (domain.startsWith('http')) {
    throw new Error(`Endpoint "${endpoint.name}" should not start with "http" or "https"`)
  }
}

/**
 * Helper function that Creates a new axios instance for each instance
 * with the provide name and options
 * @param pluginOptions Options for the VueAxiosManager plugin
 * @param endpoint Endpoint options for which the instance should be create
 * @example
 * ```js
 * const result = createAxiosInstance({ name: 'companies' })
 * console.log(result)
 * { name: "companiesAxios", instance: Axios }
 * ```
 * @internal
 */
export function createAxiosInstance(pluginOptions: PluginOptions, endpoint: EndpointOptions): InternalEnpointOptions {
  const protocole = endpoint.https ? 'https' : 'http'
  const devDomain = endpoint.dev || `127.0.0.1:${endpoint.port || 8000}`

  checkDomain(devDomain, endpoint)

  let baseDomain: string = `${protocole}://${devDomain}`

  if (inProduction()) {
    if (!endpoint.domain) {
      throw new Error(`You need to set domain for "${endpoint.name}" endpoint for production environments`)
    } else {
      baseDomain = endpoint.domain
      checkDomain(baseDomain, endpoint)
    }
  }

  // console.log('createAxiosInstance.baseDomain', baseDomain)

  const axiosOptions = pluginOptions.axios || endpoint.axios || {}
  const instance = axios.create({
    baseURL: baseDomain,
    ...axiosOptions
  })

  const finalOptions = {
    ...endpoint,
    internalName: createInternalEndpointName(endpoint.name),
    endpointDomain: baseDomain,
    instance
  }

  if (typeof finalOptions.disableAccess === 'undefined') {
    finalOptions.disableAccess = false
  }

  if (typeof finalOptions.disableRefresh === 'undefined') {
    finalOptions.disableRefresh = false
  }

  if (endpoint.disableAuth) {
    finalOptions.disableAccess = true
    finalOptions.disableRefresh = true
  }

  return finalOptions
}
