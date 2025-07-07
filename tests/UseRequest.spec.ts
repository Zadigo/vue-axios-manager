import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRequest } from '../src/plugins'

import axios from 'axios'
import { ref } from 'vue'

const mockAxios = vi.mocked(axios)

describe('Test composables', () => {
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
    mockAxios.create.mockReturnValue(mockAxiosInstance)
  })

  afterAll(() => {
    vi.resetAllMocks()
  })

  describe('useRequest', () => {
    it.fails('should fail without Vue context and no baseUrl', () => {
      useRequest('testendpoint', '/v1/endpoint')
    })

    it('should create axios instance with baseUrl when no Vue context', () => {
      const { execute, status, responseData } = useRequest('testendpoint', '/v1/endpoint', {
        baseUrl: 'http://example.com'
      })
  
      // Verify axios.create was called with correct config
      expect(mockAxios.create).toHaveBeenCalledWith({
        baseURL: 'http://example.com',
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
        timeout: 20000
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

    it.skip('should handle request errors', async () => {
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

    it.skip('should set up watch when watch option is provided', () => {
      const { watchDebounced } = require('@vueuse/core')
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
  })
  
  it('should return expected items', async () => {
    const { execute, status, responseData } = useRequest('testendpoint', '/v1/endpoint', { baseUrl: 'http://example.com' })

    expect(execute).toBeTypeOf('function')
    expect(status.value).toBeTypeOf('string')
    expect(status.value).to.equal('idle')
    expect(responseData.value).toBeUndefined()
  })
})
