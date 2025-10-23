import { describe, expect, it, vi } from 'vitest'
import { createAxiosInstance } from '../src/'
import { PluginOptions } from '../src/lib/types'

describe('test createAxiosInstance', () => {
  const options: PluginOptions = {
    endpoints: [
      {
        name: 'quart',
        dev: '127.0.0.1'
      }
    ]
  }

  it('should return a valid options dictionnary', () => {
    const result = createAxiosInstance(options, options.endpoints[0])
    expect(result).toBeDefined()
    expect(result.disableAccess).toBeFalsy()
    expect(result.disableRefresh).toBeFalsy()
    expect(result.dev).toEqual('127.0.0.1')
    expect(result.instance).toBeDefined()
    expect(result.endpointDomain).toEqual('http://127.0.0.1')
  })

  it('should expect domain in production', () => {
    vi.stubEnv('NODE_ENV', 'production')
    expect(() => createAxiosInstance(options, options.endpoints[0])).toThrowError(`You need to set domain for "${options.endpoints[0].name}" endpoint for production environments`)
    vi.unstubAllEnvs()
  })

  it('dev domain should not start with http', () => {
    const newOptions = { ...options }
    newOptions.endpoints[0].dev = 'http://127.0.0.1'
    expect(() => createAxiosInstance(options, options.endpoints[0])).toThrowError(Error)
  })
})
