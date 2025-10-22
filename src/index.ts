export { createVueAxiosManager } from './lib/base'
export { useAsyncRequest, useAxiosLogin, useRequest } from './lib/composables'
export { vueAxiosManager, VueAxiosManager } from './lib/manager'
export { checkDomain, createAxiosInstance, createInternalEndpointName, inProduction } from './lib/utils'

export type {
  AsyncComposableOptions,
  ComposableOptions,
  Credentials,
  EndpointOptions,
  ExtendedInternalAxiosRequestConfig,
  InternalEnpointOptions,
  LoginApiResponse,
  LoginComposableOptions,
  PluginOptions
} from './lib/types'
