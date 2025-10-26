<template>
  <request-card :data="responseData" :status="status">
    <button class="btn btn-primary" @click="execute">With cache</button>
  </request-card>
</template>

<script setup lang="ts">
import { useRequest } from '../../src/lib/composables'
import RequestCard from './RequestCard.vue'

/**
 * A component that demonstrates the use of `useRequest` composable
 * with an input field to perform searches
 */

const { responseData, execute, status } = useRequest('comments', '/todos/10', { cache: true })
</script>
