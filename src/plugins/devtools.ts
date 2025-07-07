import { setupDevtoolsPlugin } from '@vue/devtools-api'

import type { App } from 'vue'
import type { _DevtoolsTimelineObject, InternalEndpointOptionKeys, InternalEnpointOptions, PluginOptions, RequestsContainer, RequestStoreClass } from './types'

const inspectorId = 'axios-manager'
const timelineLayerId = 'axios-manager'

/**
 * Internal store used to track requests for
 * the vue devtool interface
 * @internal
 */
export class RequestStore implements RequestStoreClass {
  private app: App
  public api
  private pluginOptions: PluginOptions
  public container: RequestsContainer[]
  public internalEndpoints: InternalEnpointOptions[]

  constructor(app: App, pluginOptions: PluginOptions, internalEndpoints: InternalEnpointOptions[]) {
    this.app = app
    this.pluginOptions = pluginOptions
    this.container = []
    this.internalEndpoints = internalEndpoints
  }

  get instanceNames(): string[] {
    return this.pluginOptions.endpoints.map(option => option.name)
  }

  get last(): RequestsContainer {
    console.log(this.container[this.container.length - 1])
    console.log(this.container)

    // "this.api" gets populate only when we access
    // the Axios Manager tab in the devtools
    if (this.api) {
      this.api.addTimelineEvent({
        layerId: timelineLayerId,
        event: {
          time: this.api.now(),
          data: this.last
        }
      })
    }

    return this.container[this.container.length - 1]
  }

  /**
   * @param name The name of the endpoint to get
   */
  public getEndpointValues(name: string): _DevtoolsTimelineObject[] {
    const option = this.internalEndpoints.find(item => item.name === name)
    const optionsForDevtool: _DevtoolsTimelineObject[] = []

    console.log('RequestStore: : option', option)

    if (option) {
      const keys = Object.keys(option) as InternalEndpointOptionKeys[]

      console.log('option', option, keys)

      keys.filter(key => key !== 'instance').forEach((key) => {
        const value = option[key]

        if (value) {
          optionsForDevtool.push({
            key: key,
            value
          })
        }
      })

      console.log('getEndpoint', optionsForDevtool)

      return optionsForDevtool
    } else {
      return []
    }
  }

  /**
   * Return the requests specific to a request name
   * @param name Endpoint name to get
   */
  public filterByName(name: string) {
    return this.container.filter(item => item.name === name)
  }

  /**
   * Register a new endpoint name
   * @param name The name of the endpoint to register
   */
  public registerName(name: string) {
    this.instanceNames.push(`$${name}Axios`)
  }

  /**
   * Register a new request
   * @param options The options for the request
   */
  public registerRequest(params: RequestsContainer) {
    // this.api.addTimelineEvent({
    //   layerId: timelineLayerId,
    //   event: {
    //     time: this.api.now(),
    //     data: this.last
    //   }
    // })

    this.container.push(params)
  }
}

export function setupAxiosManagerDevtools(app: App, store: InstanceType<typeof RequestStore>) {
  setupDevtoolsPlugin({
    app,
    id: 'axios-manager',
    label: 'Axios Manager',
    packageName: 'axios-manager',
    homepage: '',
    settings: {
      // https://devtools-v6.vuejs.org/plugin/plugins-guide.html#plugin-settings
    }
  }, (api) => {
    // https://devtools-v6.vuejs.org/plugin/plugins-guide.html#custom-inspector

    store.api = api

    api.addInspector({
      id: inspectorId,
      label: 'Axios Manager',
      icon: 'web_traffic'
    })

    // Inspector Tree

    api.on.getInspectorTree((payload) => {
      if (payload.inspectorId === inspectorId) {
        payload.rootNodes = store.internalEndpoints.map(endpoint => ({
          id: endpoint.name,
          label: endpoint.name,
          tags: [
            {
              label: endpoint.label?.toLowerCase().trim() || 'Axios',
              textColor: 0xffffff,
              backgroundColor: 0x000000
            }
          ]
        }))
      }
    })

    api.on.getInspectorState((payload) => {
      if (payload.inspectorId === inspectorId) {
        payload.state = {
          options: store.getEndpointValues(payload.nodeId)
        }
      }
    })

    // Timeline

    api.addTimelineLayer({
      id: timelineLayerId,
      color: 0xff984f,
      label: 'Axios Manager'
    })
  })
}
