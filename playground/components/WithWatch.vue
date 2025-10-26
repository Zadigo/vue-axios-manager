<template>
  <request-card :data="responseData" :status="status">
    <button class="btn btn-primary btn-rounded btn-block shadow-none" @click="() => updateCount()">
      Test with watch
    </button>
  </request-card>
</template>

<script setup lang="ts">
import { useCounter, useUrlSearchParams } from '@vueuse/core'
import { useRequest } from '../../src/lib/composables'
import ResultBox from './ResultBox.vue'
import RequestCard from './RequestCard.vue'

/**
 * Usage with watch
 * @description When the watch changes, the request should be re-executed
 */

const { count, inc } = useCounter(1)
const queryParams = useUrlSearchParams('history') as { count: string }

const { responseData, status } = useRequest('quart', '/v1/test', {
  watch: [count]
})

function updateCount() {
  inc()
  queryParams.count = count.value.toString()
}
</script>
