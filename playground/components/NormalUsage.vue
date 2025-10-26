<template>
  <request-card :data="responseData" :status="status">
    <button class="btn btn-info btn-rounded btn-block shadow-none" @click="execute">
      Normal usage
    </button>
  </request-card>
</template>

<script setup lang="ts">
import { useRequest } from '../../src/lib/composables'
import RequestCard from './RequestCard.vue'

/**
 * Nnormal usage
 * @description The composable is in script setup and executed via a button click
 */

const { execute, responseData, status } = useRequest('quart', '/v1/test')
</script>
