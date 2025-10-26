<template>
  <request-card :data="responseData" :status="status">
    <input type="text" v-model="search" class="form-control mb-3" placeholder="Type to search..." />
    <button class="btn btn-primary" @click="execute">Search</button>
  </request-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRequest } from '../../src/lib/composables'
import RequestCard from './RequestCard.vue'

/**
 * A component that demonstrates the use of `useRequest` composable
 * with an input field to perform searches
 */

const search = ref('')

const { responseData, execute, status } = useRequest('comments', '/todos/1', {
  query: { q: search, r: '', n: 1 },

})
</script>
