import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRequest } from '../plugins'

export const useComments = defineStore('comments', () => {
  const comments = ref<object[]>([])

  async function handleComments() {
    const { execute, responseData } = useRequest('quart', '/v1/test')
    execute()

    if (responseData.value) {
      comments.value = responseData.value
    }
  }

  return {
    handleComments,
    comments
  }
})
