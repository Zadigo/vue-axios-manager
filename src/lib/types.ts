import type { Axios, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { App, Reactive, Ref, ToRefs } from 'vue'

export type _Partialize<T> = {
  [K in keyof Partial<T>]: T[K]
}

export type StringTypes = string | number | boolean

export type MultiTypeRecord<T> = Record<string, StringTypes | T>

export type UnknownRecord<K extends string> = Record<K, unknown>

export type Undefineable<T> = T | undefined

export type Nullable<T> = T | null

export type Empty<T> = Undefineable<T> | Nullable<T>

export type Arrayable<T> = T[]

export type Refeable<T> = Ref<T>

export type ArrayableRef<T> = Ref<Arrayable<T>>

type InternalAxiosRequestConfig = Omit<AxiosRequestConfig, 'baseURL' | 'data' | 'params' | 'method' | 'url'>

export interface ExtendedInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

export type QueryType = MultiTypeRecord<Refeable<StringTypes>>

interface SharedOptions {
  /**
   * Axios configuration options to pass to the instance
   */
  axios?: InternalAxiosRequestConfig
  /**
   * The bearer for the autorization token of this endpoint
   * @default "Token"
   */
  bearer?: string
  /**
   * Disables both access and refresh token verification and workflow. This option
   * will override the `disableAccess` and `disableRefresh` options regardless of
   * what they are set to `true` or `false`.
   * @description This is useful for endpoints that do not require authentication
   * @default false
   */
  disableAuth?: boolean
}

export interface EndpointOptions extends SharedOptions {
  /**
   * Endpoint name
   */
  name: string
  /**
   * Adds a label to better identify the endpoint
   * in devtools
   * @default "Axios"
   */
  label?: string
  /**
   * Default development domain
   * @default "127.0.0.1"
   */
  dev?: string
  /**
   * Port for the default development domain
   * @default "8000"
   */
  port?: string
  /**
   * The production domain
   * @example "example.com"
   */
  domain?: string
  /**
   * Path used to authenticate a user
   * @default "/v1/token"
   */
  accessEndpoint?: string
  /**
   * Path used to refresh an access token
   * @default "/v1/refresh/token"
   */
  refreshEnpoint?: string
  /**
   * Whether to use https for the development endpoint
   * @default false
   */
  https?: boolean
  /**
   * Key to the access token in the storage
   * @default "access"
   */
  accessKey?: string
  /**
   * Key to the refresh token in the storage
   * @default "refresh"
   */
  refreshKey?: string
  /**
   * Disables the access token verification
   * @default false
   */
  disableAccess?: boolean
  /**
   * Disables the refresh token refresh workflow
   * @default false
   */
  disableRefresh?: boolean
}

export interface PluginOptions extends SharedOptions {
  /**
   * Global to implement for all instances
   * @default 20000
   */
  timeout?: number
  /**
   * Options for the endpoint
   */
  endpoints: EndpointOptions[]
}

export type EndpointOptionKeys = keyof EndpointOptions

/**
 * @description For internal use
 */
export interface InternalEnpointOptions extends EndpointOptions {
  /**
   * Name used to identify the endpoint in
   * Vue's globalProperties
   * @example "$endpointAxios"
   */
  internalName: string
  /**
   * The full url for the endpoint
   */
  endpointDomain: string
  /**
   * The Axios instance for this endpoint
   */
  instance: Axios
}

export type InternalEndpointOptionKeys = keyof InternalEnpointOptions

export type AxiosTransformedData<T> = T extends AxiosResponse<infer N> ? N : undefined

export interface ComposableOptions<T> {
  /**
   * Provide a domain which will supersede
   * the both the initial domain or dev values
   * provided for the endpoint
   * ```js
   * const { execute } = useRequest('endpoint', '/path', {
   *   baseUrl: 'http://example.com'
   * })
   * await execute()
   * ```
   */
  baseUrl?: string
  /**
   * Metthod for the request
   * @default "get"
   */
  method?: Methods
  /**
   * Request body
   */
  body?: UnknownRecord<string>
  /**
   * Request query
   */
  query?: QueryType
  /**
   * Hook to execute before the request starts
   */
  beforeStart?: () => void
  /**
   * Hook used after the request has finished
   * @param response The response for the request
   */
  completed?: (data: T, response: AxiosResponse<T>) => AxiosTransformedData<T> | T
  /**
   * Watch and trigger requests based on a parameter
   */
  watch?: (Ref<string> | Ref<number> | Ref<UnknownRecord<string>>)[]
  /**
   * Cache the results of the requested API
   */
  // cache: UseMemoizeOptions<>
}

export interface AsyncComposableOptions<T> extends ComposableOptions<T> {
  /**
   * Executes the request immediately
   * @default false
   */
  immediate?: boolean
  /**
   * Debounce the execution of the request by the provided
   * milliseconds
   * @default 0
   */
  debounce?: number
}

export type LoginComposableOptions<T> = Omit<ComposableOptions<T>, 'method' | 'body'>

/**
 * @todo rename to "HttpMethods"
 */
export type Methods = 'get' | 'post' | 'delete' | 'put' | 'patch'

export interface Credentials extends Record<string, Undefineable<string>> {
  /**
   * Username to use
   */
  username?: string
  /**
   * Email to use
   */
  email?: string
  /**
   * Password to use
   */
  password: string
}

/**
 * Store
 */

/**
 * Container for the requests sent
 * @internal
 */
export interface RequestsContainer {
  name: string
  method: Methods
  statusText: string
  data: UnknownRecord<string>
  headers: string
  path: Undefineable<string>
}

/**
 * @internal
 */
export interface _DevtoolsTimelineObject {
  key: string
  value: Undefineable<string | boolean | ExtendedInternalAxiosRequestConfig>
}

export interface LoginApiResponse {
  /**
   * Access token
   */
  access: string
  /**
   * Refresh token
   */
  refresh: string
}

export type RefreshApiResponse = Omit<LoginApiResponse, 'refresh'>

/**
 * @internal
 */
export interface _VueAxiosManager {
  pluginOptions: Undefineable<PluginOptions>
  endpoints: InternalEnpointOptions[]
  provideAttr: Record<string, InternalEnpointOptions>
  api: unknown
  container: Record<string, RequestsContainer[]>
  initialize: (app: App, pluginOptions: PluginOptions) => void
  _getRequests: (name: string) => ToRefs<Reactive<RequestsContainer[]>>
  _getLast: (name: string) => Ref<RequestsContainer>
  _registerRequest: (method: string, endpoint: Undefineable<EndpointOptions>, params: RequestsContainer, timelineLayerId?: string, isError?: boolean) => void
  _getEndpointValues: (name: string) => Undefineable<_DevtoolsTimelineObject[]>
}

/**
 * @description Basic JWT structure
 */
export type BaseJwt = {
  exp: number
  iat: number
}

export type ExtendedJwt<T> = T & BaseJwt
