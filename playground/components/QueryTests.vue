<template>
  <request-card :data="responseData" :status="status" title="Dynamic Query">
    <input type="text" v-model="search" class="form-control mb-3" placeholder="Dynamic search..." />
    <button class="btn btn-primary" @click="execute">
      Execute Request
    </button>
  </request-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RequestCard from './RequestCard.vue'
import { useRequest } from '../../src/lib/composables'
import type { Todo } from '../types'

const search = ref('')

const { responseData, execute, status } = useRequest<Todo>('comments', '/todos/1', { query: { q: search } })
</script>
