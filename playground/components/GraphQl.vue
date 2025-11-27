<template>
  <request-card :data="responseData" :status="status">
    <button class="btn btn-info btn-rounded btn-block shadow-none" @click="execute">
      GraphQL query
    </button>
  </request-card>
</template>

<script setup lang="ts">
import { useRequest } from '../../src/lib/composables'

import RequestCard from './RequestCard.vue'

const { responseData, status, execute } = useRequest<{ data: { allSongs: { id: string; name: string }[] } }>('django', '/graphql/', {
  method: 'post',
  body: {
    query: `
      query {
        allSongs {
          id
          name
        }
      }
    `
  },
  completed(data) {
    console.log('GraphQL response:', data)
    return data.data.allSongs
  }
})
</script>
