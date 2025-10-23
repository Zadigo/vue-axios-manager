import { vi } from 'vitest'

vi.mock('@vueuse/core', () => ({
  useDebounceFn: vi.fn((fn, _delay) => fn),
  watchDebounced: vi.fn(),
  isDefined: vi.fn(val => val !== undefined && val !== null)
}))

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')

  return {
    ...actual,
    getCurrentInstance: vi.fn(() => undefined),
    inject: vi.fn(() => undefined)
  }
})
