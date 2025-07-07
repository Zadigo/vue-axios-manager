import { afterEach, describe, expect, it, vi } from 'vitest'
import { createAxiosInstance, createInternalEndpointName, inProduction } from '../src/plugins'
import axios from 'axios'
// import {  } from 'node:inspector'

describe('utility functions', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

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
    const endpoint = createAxiosInstance({ name: 'myendpoint' })
  
    expect(endpoint).toBeTypeOf('object')

    // expect(endpoint.instance).toBeInstanceOf(axios.Axios)
    expect(endpoint.internalName).toBeDefined()
    expect(endpoint.port).toBeUndefined()
    expect(endpoint.dev).toBeUndefined()
    expect(endpoint.endpointDomain).toEqual('http://127.0.0.1:8000')
    expect(endpoint.internalName).toEqual(createInternalEndpointName('myendpoint'))
  })

  it.fails('in production domain *must* be set', () => {
    const originalNodeEnv = process.env.NODE_ENV

    vi.stubEnv('NODE_ENV', 'production')
    createAxiosInstance({ name: 'myendpoint' })
    vi.stubEnv('NODE_ENV', originalNodeEnv)
  })
})
