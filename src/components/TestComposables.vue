<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <button class="btn btn-warning btn-rounded btn-block" @click="testFunction">
        In setup
      </button>

      <button class="btn btn-warning btn-rounded btn-block" @click="testInFunction">
        In function
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useComments } from '../stores'
import { onMounted } from 'vue'
import { useAnotherTestComposable, useTestComposable } from '../composables'
import { storeToRefs } from 'pinia'

useTestComposable()
const { testFunction } = useAnotherTestComposable()

const store = useComments()
const { comments } = storeToRefs(store)

async function testInFunction() {
  const { testFunction } = useAnotherTestComposable()
  testFunction()
}

onMounted(() => {
  testFunction()

  console.log('comments', comments)
})
</script>
