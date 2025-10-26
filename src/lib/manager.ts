import type { App } from 'vue'
import { reactive, toRefs } from 'vue'
import type { _DevtoolsTimelineObject, _VueAxiosManager, EndpointOptions, InternalEndpointOptionKeys, InternalEnpointOptions, PluginOptions, RequestsContainer } from './types'
import { createAxiosInstance, inProduction } from './utils'

/**
 * Manager that centralizes the different options
 * of the application for different functions
 * @internal
 */
export class VueAxiosManager implements _VueAxiosManager {
  public pluginOptions: PluginOptions | undefined
  public endpoints: InternalEnpointOptions[]
  public provideAttr: Record<string, InternalEnpointOptions>

  public api: unknown
  public container: Record<string, RequestsContainer[]>

  constructor() {
    this.pluginOptions = undefined
    this.endpoints = []
    this.provideAttr = {}
    this.container = {}
  }

  /**
   * Initialize the manager
   * @param app The vue application
   * @param pluginOptions The optioons for the plugin
   */
  public initialize(app: App, pluginOptions: PluginOptions) {
    this.pluginOptions = pluginOptions

    this.endpoints = pluginOptions.endpoints.map((endpointOptions) => {
      const result = createAxiosInstance(pluginOptions, endpointOptions)
      app.config.globalProperties[result.internalName] = result.instance
      return result
    })

    this.endpoints.forEach((endpoint) => {
      this.provideAttr[endpoint.name] = endpoint
      this.container[endpoint.name] = []
    })
  }

  /**
   * Return the requests for a given endpoint
   * @param name The name of the endpoint
   */
  public _getRequests(name: string) {
    return toRefs(reactive(this.container[name]))
  }

  /**
   * The last request of the given array
   * @param name Return the last request sent by a given enpoint
   */
  public _getLast(name: string) {
    const requests = this._getRequests(name)
    // @ts-expect-error length is Ref.length
    return requests[requests.length - 1]
  }

  /**
   * Register a new request
   * @param options The options for the request
   */
  public _registerRequest(method: string, endpoint: EndpointOptions | undefined, params: RequestsContainer, timelineLayerId?: string, isError: boolean = false) {
    if (!endpoint) {
      return
    }

    if (!inProduction()) {
      if (this.api) {
        // @ts-expect-error no export
        this.api.addTimelineEvent({
          layerId: timelineLayerId || 'axios-manager',
          event: {
            // @ts-expect-error no export
            time: this.api.now(),
            title: method,
            subtitle: 'Axios Request',
            logType: isError ? 'error' : 'default',
            groupId: method,
            data: params
          }
        })
      }

      try {
        // console.log('VueAxiosManager.container', this.container)
        this.container[endpoint.name].push(params)
      } catch (e: unknown) {
        // @ts-expect-error Unknown error
        throw new Error(e)
      }
    }
  }

  /**
   * @param name The name of the endpoint to get
   */
  public _getEndpointValues(name: string): _DevtoolsTimelineObject[] | undefined {
    const option = this.endpoints.find(item => item.name === name)
    const optionsForDevtool: _DevtoolsTimelineObject[] = []

    // console.log('RequestStore: : option', option)

    if (option) {
      const keys = Object.keys(option) as InternalEndpointOptionKeys[]

      // console.log('option', option, keys)

      keys.filter(key => key !== 'instance').forEach((key) => {
        const value = option[key]

        if (value) {
          optionsForDevtool.push({
            key: key,
            value
          })
        }
      })
      // console.log('getEndpoint', optionsForDevtool)
      return optionsForDevtool
    }
  }
}

export const vueAxiosManager = new VueAxiosManager()
