import { defineStore } from 'pinia'
import { ref } from 'vue'
import { RequestStatus, useRequest } from '../../src/lib/composables'

interface Comment {
  postId: number
  id: number
  name: string
  email: string
  body: string
}

export const useComments = defineStore('comments', () => {
  const comments = ref<Comment[]>()
  const state = ref<RequestStatus>('idle')

  async function handleComments() {
    const { execute, responseData, status } = useRequest<Comment[]>('quart', '/v1/test')
    await execute()

    state.value = status.value

    if (responseData.value) {
      comments.value = responseData.value
    }
  }

  return {
    handleComments,
    state,
    comments
  }
})
