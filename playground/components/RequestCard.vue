<template>
  <div class="card">
    <div class="card-body">
      <div class="badge text-bg-info mb-2">{{ status }}</div>

      <h5 class="card-title font-bold">{{ title }}</h5>

      <div class="result bg-light rounded p-1 mb-3">
        <pre>{{ data }}</pre>
      </div>
  
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  data: object
  status?: string
}>()
</script>

<style scoped>
.result {
  min-height: 150px;
  max-height: 200px;
  overflow-y: scroll;
  box-shadow: inset var(--mdb-card-box-shadow);
}
</style>
