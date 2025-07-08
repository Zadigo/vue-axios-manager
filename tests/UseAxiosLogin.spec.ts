import { describe, expect, it, vi, afterAll, beforeEach } from 'vitest'
import { useAxiosLogin, vueAxiosManager } from '../src/plugins'

import axios from 'axios'

const mockAxios = vi.mocked(axios)

describe.skip('useAxiosLogin', () => {
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

    const endpoints = [
      {
        name: 'auth',
        internalName: '$authAxios',
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

  it('should execute login request with credentials', async () => {
    const mockResponse = {
      data: { token: 'abc123', user: { id: 1, name: 'John' } },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url: '/auth/login' }
    }

    mockAxiosInstance.post.mockResolvedValue(mockResponse)

    const credentials = { username: 'john', password: 'password' }
    const responseData = await useAxiosLogin(
      credentials,
      'auth',
      '/auth/login'
      // { baseUrl: 'http://example.com' }
    )

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/login', credentials)
    expect(responseData.value).toEqual(mockResponse.data)
  })

  it('should handle login failure', async () => {
    const mockError = new Error('Invalid credentials')
    mockAxiosInstance.post.mockRejectedValue(mockError)

    const credentials = { username: 'john', password: 'wrong' }
    const responseData = await useAxiosLogin(
      credentials,
      'auth',
      '/auth/login'
      // { baseUrl: 'http://example.com' }
    )

    expect(responseData.value).toBeUndefined()
  })
})
