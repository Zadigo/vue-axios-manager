<template>
  <request-card :data="responseData" :status="status" title="Suspense Delayed" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAsyncRequest } from '../../src/lib/composables'
import RequestCard from './RequestCard.vue'

const { execute, responseData, status } = await useAsyncRequest('comments', '/todos/1', {
  debounce: 10000
})

onMounted(async () => {
  await execute()
})
</script>
