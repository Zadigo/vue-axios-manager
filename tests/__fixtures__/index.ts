import { vi } from 'vitest'
import type { EndpointOptions, InternalEnpointOptions, PluginOptions, RequestsContainer } from '../../src/lib'

import axios from 'axios'

// const mockAxios = vi.mocked(axios)

export const mockEndpoint: EndpointOptions = {
  name: 'testendpoint',
  label: 'test'
}

export const mockInternalEndpoint: InternalEnpointOptions = {
  internalName: '$testEndpointAxios',
  endpointDomain: 'http://example.com',
  // instance: mockAxios,
  instance: vi.mocked(axios),
  ...mockEndpoint
}

export const fakePluginOptions: PluginOptions = {
  endpoints: [mockEndpoint]
}

export const mockProvideAttr: Record<string, InternalEnpointOptions> = {
  testendpoint: mockInternalEndpoint
}

export const mockRequest: RequestsContainer = {
  data: { id: 1 },
  headers: '{}',
  method: 'get',
  name: 'testendpoint',
  path: '/',
  statusText: 'Some text'
}
