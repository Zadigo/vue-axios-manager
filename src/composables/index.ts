import { getCurrentInstance } from 'vue'

export function useTestComposable() {
  const app = getCurrentInstance()

  console.log('useTestComposable.app', app)

  function testFunction() {
    console.log('useTestComposable.testFunction.app', app)
  }

  return {
    testFunction
  }
}

export function useAnotherTestComposable() {
  const { testFunction } = useTestComposable()

  return {
    testFunction
  }
}
