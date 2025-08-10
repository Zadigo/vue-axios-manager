<template>
  <div class="card-body">
    <h5>Delayed</h5>
    <p class="card-text">
      {{ responseData }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAsyncRequest } from '../lib/composables'

const { debouncedExecute, responseData } = await useAsyncRequest('comments', '/todos/1', {
  debounce: 10000
})

onMounted(async () => {
  await debouncedExecute()
})
</script>
