import { useDebounceFn } from '@vueuse/core'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { InternalEnpointOptions, useAsyncRequest, vueAxiosManager } from '../src'
import { mockInternalEndpoint, mockProvideAttr } from './__fixtures__'

import axios from 'axios'

const mockAxios = vi.mocked(axios)

const fakeVueAxiosManager = {
  endpoints: [mockInternalEndpoint] as InternalEnpointOptions[],
  provideAttr: mockProvideAttr as Record<string, InternalEnpointOptions>,
  _registerRequest: vi.fn()
}

vi.spyOn(vueAxiosManager, 'initialize').mockImplementation(() => {
  Object.assign(vueAxiosManager, fakeVueAxiosManager)
})

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
    // @ts-expect-error Is mock
    mockAxios.create.mockReturnValue(mockAxiosInstance)

    const endpoints = [
      {
        name: 'testendpoint',
        internalName: '$testendpointAxios',
        endpointDomain: 'http://example.com',
        instance: mockAxios
      }
    ]
    vueAxiosManager.endpoints = endpoints

    vueAxiosManager.provideAttr = {
      testendpoint: endpoints[0]
    }

    vueAxiosManager.pluginOptions = {
      endpoints: endpoints
    }
  })

  afterAll(() => {
    vi.resetAllMocks()
  })

  it('should return expected properties', async () => {
    const mockDebouncedFn = vi.fn()
    // @ts-expect-error Is mock
    useDebounceFn.mockReturnValue(mockDebouncedFn)

    const result = await useAsyncRequest('testendpoint', '/v1/endpoint', {
      baseUrl: 'http://example.com'
    })

    expect(result.debouncedExecute).toBe(mockDebouncedFn)
    expect(result.status.value).toBe('idle')
    expect(result.responseData.value).toBeUndefined()
    expect(result.completed.value).toBeFalsy()
  })

  it('should execute immediately when immediate option is true', async () => {
    const mockDebouncedFn = vi.fn()
    // @ts-expect-error Is mock
    useDebounceFn.mockReturnValue(mockDebouncedFn)

    await useAsyncRequest('testendpoint', '/v1/endpoint', {
      baseUrl: 'http://example.com',
      immediate: true
    })

    expect(mockDebouncedFn).toHaveBeenCalled()
  })

  it('should use custom debounce value', async () => {
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
