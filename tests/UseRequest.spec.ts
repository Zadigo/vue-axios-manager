import { watchDebounced } from '@vueuse/core'
import { useCookies } from '@vueuse/integrations/useCookies.mjs'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useRequest, vueAxiosManager } from '../src'
import type { InternalEnpointOptions } from '../src/lib/types'
import { mockInternalEndpoint, mockProvideAttr } from './__fixtures__'

import axios from 'axios'

const mockAxios = vi.mocked(axios)

vi.spyOn(vueAxiosManager, 'initialize').mockImplementation(() => {
  Object.assign(vueAxiosManager, {
    endpoints: [mockInternalEndpoint] as InternalEnpointOptions[],
    provideAttr: mockProvideAttr as Record<string, InternalEnpointOptions>,
    _registerRequest: vi.fn()
  })
})

describe('useRequest composable', () => {
  let mockAxiosInstance: any

  beforeEach(() => {
    // Create a mock axios instance
    mockAxiosInstance = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      patch: vi.fn(),
      head: vi.fn(),
      options: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      },
      defaults: {
        baseURL: 'http://127.0.0.1:8000'
      }
    }

    // Mock axios.create to return our mock instance
    // @ts-expect-error Mock create
    mockAxios.create.mockReturnValue(mockAxiosInstance)

    const endpoints = [
      {
        name: 'testendpoint',
        internalName: '$testendpointAxios',
        endpointDomain: 'http://example.com',
        instance: mockAxios
      },
      {
        name: 'api',
        internalName: '$apiAxios',
        endpointDomain: 'http://example.com',
        instance: mockAxios
      }
    ]

    vueAxiosManager.endpoints = endpoints
    vueAxiosManager.provideAttr = { testendpoint: endpoints[0] }
    vueAxiosManager.pluginOptions = { endpoints }
  })

  afterAll(() => {
    vi.resetAllMocks()
  })

  it('should create axios instance with baseUrl when no Vue context', () => {
    const { execute, status, responseData } = useRequest('testendpoint', '/v1/endpoint', {
      baseUrl: 'http://example.com'
    })

    // Verify axios.create was called with correct config
    expect(mockAxios.create).toHaveBeenCalledWith({
      baseURL: 'http://example.com',
      // headers: { 'Content-Type': 'application/json' },
      // withCredentials: true,
      // timeout: 20000
    })

    // Verify interceptors were set up
    expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled()
    expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled()

    // Verify return values
    expect(execute).toBeTypeOf('function')
    expect(status.value).toBe('idle')
    expect(responseData.value).toBeUndefined()
  })

  it('should execute GET request successfully', async () => {
    const mockResponse = {
      data: { id: 1, name: 'test' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url: '/v1/endpoint' }
    }

    mockAxiosInstance.get.mockResolvedValue(mockResponse)

    const { execute, status, responseData } = useRequest('testendpoint', '/v1/endpoint', {
      baseUrl: 'http://example.com'
    })

    await execute()

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/v1/endpoint', { params: undefined })
    expect(status.value).toBe('success')
    expect(responseData.value).toEqual(mockResponse.data)
  })

  it('should execute POST request with body', async () => {
    const mockResponse = {
      data: { success: true },
      status: 201,
      statusText: 'Created',
      headers: {},
      config: { url: '/v1/endpoint' }
    }

    const requestBody = { name: 'test', email: 'test@example.com' }

    mockAxiosInstance.post.mockResolvedValue(mockResponse)

    const { execute } = useRequest('testendpoint', '/v1/endpoint', {
      baseUrl: 'http://example.com',
      method: 'post',
      body: requestBody
    })

    await execute()

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/v1/endpoint', requestBody)
  })

  it('should handle request errors', async () => {
    const mockError = new Error('Network Error')
    mockAxiosInstance.get.mockRejectedValue(mockError)

    const { execute, status } = useRequest('testendpoint', '/v1/endpoint', {
      baseUrl: 'http://example.com'
    })

    await execute()

    expect(status.value).toBe('error')
  })

  it('should call beforeStart callback', async () => {
    const beforeStart = vi.fn()

    const { execute } = useRequest('testendpoint', '/v1/endpoint', {
      baseUrl: 'http://example.com',
      beforeStart
    })

    await execute()

    expect(beforeStart).toHaveBeenCalled()
  })

  it('should call completed callback on success', async () => {
    const completed = vi.fn()
    const mockResponse = {
      data: { id: 1 },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url: '/v1/endpoint' }
    }

    mockAxiosInstance.get.mockResolvedValue(mockResponse)

    const { execute } = useRequest('testendpoint', '/v1/endpoint', {
      baseUrl: 'http://example.com',
      completed
    })

    await execute()

    expect(completed).toHaveBeenCalledWith(mockResponse)
    // TODO: completed should *always* return something ??
    // expect(completed).toReturnWith(mockResponse.data)
  })

  it('should handle different HTTP methods', async () => {
    const methods = ['post', 'put', 'delete', 'patch'] as const

    for (const method of methods) {
      const mockResponse = {
        data: { method },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { url: '/v1/endpoint' }
      }

      mockAxiosInstance[method].mockResolvedValue(mockResponse)

      const { execute } = useRequest('testendpoint', '/v1/endpoint', {
        baseUrl: 'http://example.com',
        method,
        body: { test: 'data' }
      })

      await execute()

      expect(mockAxiosInstance[method]).toHaveBeenCalledWith('/v1/endpoint', { test: 'data' })
    }
  })

  it('should set up watch when watch option is provided', () => {
    const watchRef = ref('test')

    useRequest('testendpoint', '/v1/endpoint', {
      baseUrl: 'http://example.com',
      watch: watchRef
    })

    expect(watchDebounced).toHaveBeenCalledWith(
      watchRef,
      expect.any(Function),
      expect.objectContaining({
        debounce: 300,
        onTrigger: expect.any(Function)
      })
    )
  })

  it('should return expected items', async () => {
    const { execute, status, responseData } = useRequest('testendpoint', '/v1/endpoint', { baseUrl: 'http://example.com' })

    expect(execute).toBeTypeOf('function')
    expect(status.value).toBeTypeOf('string')
    expect(status.value).to.equal('idle')
    expect(responseData.value).toBeUndefined()
  })
})

describe.skip('Request Interceptors', () => {
  it('should add Authorization header when access token exists', () => {
    const mockGet = vi.fn().mockReturnValue('test-token')
    // @ts-expect-error useCookies
    useCookies.mockReturnValue({ get: mockGet, set: vi.fn() })

    useRequest('testendpoint', '/v1/endpoint', {
      baseUrl: 'http://example.com'
    })

    // Get the request interceptor that was registered
    const requestInterceptorCall = mockAxiosInstance.interceptors.request.use.mock.calls[0]
    const requestInterceptor = requestInterceptorCall[0]

    const mockRequest = { headers: {} }
    const result = requestInterceptor(mockRequest)

    expect(mockGet).toHaveBeenCalledWith('access')
    expect(result.headers.Authorization).toBe('Token test-token')
  })

  it('should not add Authorization header when no access token', () => {
    const mockGet = vi.fn().mockReturnValue(null)
    // @ts-expect-error useCookies
    useCookies.mockReturnValue({ get: mockGet, set: vi.fn() })

    useRequest('testendpoint', '/v1/endpoint', {
      baseUrl: 'http://example.com'
    })

    const requestInterceptorCall = mockAxiosInstance.interceptors.request.use.mock.calls[0]
    const requestInterceptor = requestInterceptorCall[0]

    const mockRequest = { headers: {} }
    const result = requestInterceptor(mockRequest)

    expect(result.headers.Authorization).toBeUndefined()
  })
})

describe.skip('Edge Cases', () => {
  it('should handle undefined response data', async () => {
    const mockResponse = {
      data: undefined,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url: '/v1/endpoint' }
    }

    mockAxiosInstance.get.mockResolvedValue(mockResponse)

    const { execute, responseData } = useRequest('testendpoint', '/v1/endpoint', {
      baseUrl: 'http://example.com'
    })

    await execute()

    console.log(vueAxiosManager.container)

    expect(responseData.value).toBeUndefined()
  })

  it.skip('should handle network timeout', async () => {
    const timeoutError = new Error('timeout of 20000ms exceeded')
    mockAxiosInstance.get.mockRejectedValue(timeoutError)

    const { execute, status } = useRequest('testendpoint', '/v1/endpoint', {
      baseUrl: 'http://example.com'
    })

    await execute()

    expect(status.value).toBe('error')
  })
})

describe.skip('Type Safety', () => {
  it.todo('should maintain type safety for response data', async () => {
    interface User {
      id: number
      name: string
    }

    const mockResponse = {
      data: { id: 1, name: 'John' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url: '/v1/users' }
    }

    mockAxiosInstance.get.mockResolvedValue(mockResponse)

    const { execute, responseData } = useRequest<User>('testendpoint', '/v1/users')

    await execute()

    // TypeScript should infer responseData as Ref<User | undefined>
    expect(responseData.value).toEqual({ id: 1, name: 'John' })
  })
})
