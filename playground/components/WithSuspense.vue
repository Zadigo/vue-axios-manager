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
import { useAsyncRequest } from '../../src/lib/composables'

const { execute, responseData } = await useAsyncRequest('comments', '/todos/1', {
  debounce: 10000
})

onMounted(async () => {
  await execute()
})
</script>
