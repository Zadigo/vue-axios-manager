<template>
  <request-card :data="data" :status="state">
    <button class="btn btn-info btn-rounded btn-block shadow-none" @click="testInFunction">
      Abnormal usage
    </button>
  </request-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRequest } from '../../src/lib/composables'
import RequestCard from './RequestCard.vue'

/**
 * Abnormal usage
 * @description The composable is used inside a function
 */

const data = ref()
const state = ref()

async function testInFunction() {
  const { execute, responseData, status } = useRequest('quart', '/v1/test')
  await execute()
  data.value = responseData.value
  state.value = status.value
}
</script>
