import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRequest } from '../../src/lib/composables'

interface Comment {
  postId: number
  id: number
  name: string
  email: string
  body: string
}

export const useComments = defineStore('comments', () => {
  const comments = ref<Comment[]>()

  async function handleComments() {
    const { execute, responseData, status } = useRequest<Comment[]>('quart', '/v1/test')
    await execute()

    console.log('useComments.responseData.value', responseData.value)

    if (responseData.value) {
      comments.value = responseData.value
      console.log('useComments.responseData.value', comments.value)
    }
  }

  return {
    handleComments,
    status,
    comments
  }
})
