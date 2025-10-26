<template>
  <request-card :data="comments" :status="store.state">
    <button class="btn btn-warning btn-rounded btn-block shadow-none" @click="store.handleComments">
      From Pinia
    </button>
  </request-card>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useComments } from '../stores'
import RequestCard from './RequestCard.vue'

/**
 * Pinia store
 */

const store = useComments()
const { comments } = storeToRefs(store)
</script>
