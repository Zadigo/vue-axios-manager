<template>
  <div class="card">
    <div class="card-body">
      <div class="bg-info rounded p-5 mb-3">
        {{ responseData }}
      </div>
      
      <input type="text" v-model="search" class="form-control mb-3" placeholder="Type to search..." />
      <button class="btn btn-primary" @click="execute">Search</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRequest } from '../../src/lib/composables'

/**
 * A component that demonstrates the use of `useRequest` composable
 * with an input field to perform searches
 */

const search = ref('')

const { responseData, execute } = useRequest('comments', '/todos/1', {
  query: { q: search, r: '', n: 1 },

})
</script>
