<template>
  <request-card :data="responseData" :status="status" title="Suspense Immediate" />
</template>

<script setup lang="ts">
import { useAsyncRequest } from '../../src/lib/composables'
import RequestCard from './RequestCard.vue'

const { execute, responseData, status } = await useAsyncRequest('comments', '/comments', {
  immediate: true
})
</script>
