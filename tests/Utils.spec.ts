import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { createAxiosInstance, createInternalEndpointName, inProduction, PluginOptions } from '../src/lib'

// import {  } from 'node:inspector'

const pluginOptions: PluginOptions = {
  endpoints: [
    {
      name: 'myendpoint'
    }
  ]
}

describe('utility functions', () => {
  describe('inProduction', () => {
    it('in development should return true', () => {
      expect(inProduction()).toBeFalsy()
    })

    it('in production should return true', () => {
      const originalNodeEnv = process.env.NODE_ENV

      vi.stubEnv('NODE_ENV', 'production')
      expect(inProduction()).toBeTruthy()
      vi.stubEnv('NODE_ENV', originalNodeEnv)
    })
  })

  describe('createInternalEndpointName function', () => {
    it('should return examplename as $examplenameAxios', () => {
      expect(createInternalEndpointName('examplename')).toEqual('$examplenameAxios')
    }) 
  })
})

describe('Create Axios Instance', () => {
  it('create axios instance should return endpoint configuration', () => {
    const endpoint = createAxiosInstance(pluginOptions, pluginOptions.endpoints[0])

    expect(endpoint).toBeTypeOf('object')

    // expect(endpoint.instance).toBeInstanceOf(axios.Axios)
    expect(endpoint.internalName).toBeDefined()
    expect(endpoint.dev).toBeUndefined()
    expect(endpoint.endpointDomain).toEqual('http://127.0.0.1:8000')
    expect(endpoint.internalName).toEqual(createInternalEndpointName('myendpoint'))

    // If not explicity specified these should be false
    expect(endpoint.disableAccess).toBeFalsy()
    expect(endpoint.disableRefresh).toBeFalsy()
  })

  it('should disable all auths when disableAuth is specified', () => {
    const initialEndpoint = pluginOptions.endpoints[0]
    initialEndpoint.disableAuth = true
    const endpoint = createAxiosInstance(pluginOptions, initialEndpoint)

    console.log(endpoint)

    expect(endpoint.disableAccess).toBeTruthy()
    expect(endpoint.disableRefresh).toBeTruthy()
  })
})

describe('Create Axios Instance - Production', () => {
  beforeAll(() => {
    vi.stubEnv('NODE_ENV', 'production')
  })

  afterAll(() => {
    vi.unstubAllEnvs()
  })

  it('domain *must* be set', () => {
    // const originalNodeEnv = process.env.NODE_ENV
    // console.log(originalNodeEnv)

    // vi.stubEnv('NODE_ENV', 'production')
    const initialEndpoint = pluginOptions.endpoints[0]
    initialEndpoint.domain = 'example.com'
    createAxiosInstance(pluginOptions, initialEndpoint)
    // vi.stubEnv('NODE_ENV', originalNodeEnv)
  })

  it.fails('domain cannot start with http or https', () => {
    const initialEndpoint = pluginOptions.endpoints[0]
    initialEndpoint.domain = 'http://example.com'
    createAxiosInstance(pluginOptions, initialEndpoint)
  })
})
