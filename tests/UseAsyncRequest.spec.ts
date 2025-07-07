import { describe, expect, it, vi, afterAll, beforeEach } from 'vitest'
import { useAsyncRequest } from '../src/plugins'

import axios from 'axios'

const mockAxios = vi.mocked(axios)

describe('useAsyncRequest', () => {
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

  it.skip('should return expected properties', async () => {
    const { useDebounceFn } = require('@vueuse/core')
    const mockDebouncedFn = vi.fn()
    useDebounceFn.mockReturnValue(mockDebouncedFn)

    const result = await useAsyncRequest('testendpoint', '/v1/endpoint', {
      baseUrl: 'http://example.com'
    })

    expect(result.debouncedExecute).toBe(mockDebouncedFn)
    expect(result.status.value).toBe('idle')
    expect(result.responseData.value).toBeUndefined()
    expect(result.completed.value).toBeFalsy()
  })

  it.skip('should execute immediately when immediate option is true', async () => {
    const { useDebounceFn } = require('@vueuse/core')
    const mockDebouncedFn = vi.fn()
    useDebounceFn.mockReturnValue(mockDebouncedFn)

    await useAsyncRequest('testendpoint', '/v1/endpoint', {
      baseUrl: 'http://example.com',
      immediate: true
    })

    expect(mockDebouncedFn).toHaveBeenCalled()
  })

  it.skip('should use custom debounce value', async () => {
    const { useDebounceFn } = require('@vueuse/core')

    await useAsyncRequest('testendpoint', '/v1/endpoint', {
      baseUrl: 'http://example.com',
      debounce: 500
    })

    expect(useDebounceFn).toHaveBeenCalledWith(expect.any(Function), 500)
  })

  it('should show completed as true when status is success', async () => {
    const mockResponse = {
      data: { id: 1 },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url: '/v1/endpoint' }
    }

    mockAxiosInstance.get.mockResolvedValue(mockResponse)

    const { debouncedExecute, completed } = await useAsyncRequest('testendpoint', '/v1/endpoint', {
      baseUrl: 'http://example.com'
    })

    // Manually execute since we're not using immediate
    await debouncedExecute()

    expect(completed.value).toBeTruthy()
  })

  it('should return expected items', async () => {
    const { debouncedExecute, completed, status, responseData } = await useAsyncRequest('testendpoint', '/v1/endpoint', { baseUrl: 'http://example' })

    expect(debouncedExecute).toBeTypeOf('function')
    expect(status.value).toBeTypeOf('string')
    expect(status.value).to.equal('idle')
    expect(responseData.value).toBeUndefined()
    expect(completed.value).toBeFalsy()
  })
})
