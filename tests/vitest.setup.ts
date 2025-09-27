import { vi } from 'vitest'

vi.mock('axios', async () => {
  const actual = await vi.importActual<typeof import('axios')>('axios')

  return {
    ...actual,
    create: vi.fn()
  }
})

vi.mock('@vueuse/core', () => ({
  useDebounceFn: vi.fn((fn, _delay) => fn),
  watchDebounced: vi.fn()
}))

vi.mock('@vueuse/integrations/useCookies.mjs', () => ({
  useCookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn()
  }))
}))

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')

  return {
    ...actual,
    getCurrentInstance: vi.fn(() => undefined),
    inject: vi.fn(() => undefined)
  }
})
