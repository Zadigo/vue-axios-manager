import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRequest, vueAxiosManager } from '../src'
import type { InternalEnpointOptions } from '../src/lib/types'
import { mockInternalEndpoint } from './__fixtures__'

// import axios from 'axios'

const mockedManager = vi.mocked(vueAxiosManager)
console.log('mockedManager', mockedManager)

vi.mock('axios', async () => {
  return {
    default: {
      create: vi.fn().mockReturnValue(() => ({
        get: vi.fn().mockResolvedValue({ data: { data: 'test' } }),
        post: vi.fn(),
        put: vi.fn(),
        interceptors: {
          request: {
            use: vi.fn()
          },
          response: {
            use: vi.fn()
          }
        }
      }))
    }
  }
})

describe.skip('useRequest', () => {
  beforeEach(() => {
    mockedManager.endpoints = [mockInternalEndpoint] as InternalEnpointOptions[]
    mockedManager.provideAttr = {
      testendpoint: mockInternalEndpoint
    }
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should return base implementation state', () => {
    const { status, responseData } = useRequest('testendpoint', '/v1/endpoint', { baseUrl: 'http://example.com' })
    expect(status.value).toEqual('idle')
    expect(responseData.value).toBeUndefined()
  })

  it('should execute base GET request', async () => {
    const { execute, status, responseData } = useRequest('testendpoint', '/v1/endpoint', { baseUrl: 'http://example.com' })
    await execute()

    expect(status.value).toEqual('success')
    expect(responseData.value).toEqual({ data: 'test' })
  })
})
