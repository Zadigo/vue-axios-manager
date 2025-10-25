<template>
  <div class="card">
    <div class="card-body">
      <div class="bg-info rounded p-5 mb-3">
        {{ responseData }}
      </div>
      
      <input type="text" v-model="search" class="form-control mb-3" placeholder="Type to search..." />
    </div>
  </div>
</template>

<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { ref } from 'vue'
import { useRequest } from '../../src/lib/composables'

const search = ref('')
const { responseData, execute } = useRequest('quart', '/todos/1', {
  query: { q: search.value },
  watch: [search]
})

// watchDebounced(search, () => {
//   execute()
// }, {
//   debounce: 1000,
// })
</script>
