import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRequest } from '../plugins'

export const useComments = defineStore('comments', () => {
  const comments = ref<{ status: boolean }>()

  async function handleComments() {
    const { execute, responseData } = useRequest<{ status: boolean }>('quart', '/v1/test')
    await execute()

    console.log('useComments.responseData.value', responseData.value)

    if (responseData.value) {
      comments.value = responseData.value
      console.log('useComments.responseData.value', comments.value)
    }
  }

  return {
    handleComments,
    comments
  }
})
