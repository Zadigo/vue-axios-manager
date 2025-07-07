<template>
  
</template>

<script setup lang="ts">
import { useComments } from './stores'
import { onMounted } from 'vue'
import { useAnotherTestComposable, useTestComposable } from './composables'
import { storeToRefs } from 'pinia'

useTestComposable()
const { testFunction } = useAnotherTestComposable()

const store = useComments()
const { comments } = storeToRefs(store)

onMounted(() => {
  testFunction()

  console.log('comments', comments)
})
</script>
