import { describe, expect, it, vi, afterAll, beforeEach } from 'vitest'
import { useAxiosLogin } from '../src/plugins'

import axios from 'axios'

const mockAxios = vi.mocked(axios)

describe('useAxiosLogin', () => {
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
      '/auth/login',
      { baseUrl: 'http://example.com' }
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
      '/auth/login',
      { baseUrl: 'http://example.com' }
    )

    expect(responseData.value).toBeUndefined()
  })
})
