import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAnotherTestComposable } from '../composables'

export const useComments = defineStore('comments', () => {
  const comments = ref<string[]>([])

  const { testFunction } = useAnotherTestComposable()

  return {
    testFunction,
    comments
  }
})
