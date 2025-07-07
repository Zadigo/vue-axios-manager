import { vi } from 'vitest'

import axios from 'axios'

vi.mock('axios')
const mockAxios = vi.mocked(axios)

// Mock @vueuse/core
vi.mock('@vueuse/core', () => ({
  useDebounceFn: vi.fn((fn, delay) => fn),
  watchDebounced: vi.fn()
}))

// Mock @vueuse/integrations/useCookies
vi.mock('@vueuse/integrations/useCookies.mjs', () => ({
  useCookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn()
  }))
}))

// Mock Vue's getCurrentInstance
vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')

  return {
    ...actual,
    getCurrentInstance: vi.fn(() => undefined), // Default to null (no Vue context)
    inject: vi.fn(() => undefined)
  }
})
