import { vi } from 'vitest'
import type { EndpointOptions, InternalEnpointOptions, PluginOptions, RequestsContainer } from '../../src'

import axios from 'axios'

const mockAxios = vi.mocked(axios)

export const mockEndpoint: EndpointOptions = {
  name: 'testendpoint'
}

export const mockInternalEndpoint: InternalEnpointOptions = {
  internalName: '$testEndpointAxios',
  endpointDomain: 'http://example.com',
  instance: mockAxios,
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
