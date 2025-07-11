import { beforeEach, describe, expect, it } from 'vitest'
import { isRef } from 'vue'
import { _VueAxiosManager, VueAxiosManager } from '../src/plugins'
import { fakePluginOptions, mockEndpoint, mockRequest } from './__fixtures__'

describe('Vue Axios Manager', () => {
  let instance: _VueAxiosManager
  let fakeApp: unknown

  beforeEach(() => {
    instance = new VueAxiosManager()
    fakeApp = { config: { globalProperties: {} } }
  })

  it('should initialize all the parts', async () => {
    // @ts-expect-error Vue App
    instance.initialize(fakeApp, fakePluginOptions)
    expect(instance.endpoints.length).toBe(1)
    expect(instance.provideAttr['testendpoint']).toBeTypeOf('object')
    expect(instance.pluginOptions).toBeDefined()
  })

  it('should be able to register request', () => {
    // @ts-expect-error Vue App
    instance.initialize(fakeApp, fakePluginOptions)
    instance._registerRequest(mockEndpoint, mockRequest)

    expect(instance.container['testendpoint'].length).toBe(1)

    const results = instance._getRequests('testendpoint')

    expect(Array.isArray(results)).toBeTruthy()
    expect(isRef(instance._getLast('testendpoint'))).toBeTruthy()
  })

  it('should return correct format for dev endpoint values', () => {
    // @ts-expect-error Vue App
    instance.initialize(fakeApp, fakePluginOptions)

    const values = instance._getEndpointValues('testendpoint')
    expect(values).toBeDefined()
    values?.forEach((value) => {
      const keys = Object.keys(value)
      expect(keys).includes('key')
      expect(keys).includes('value')
    })
  })
})
