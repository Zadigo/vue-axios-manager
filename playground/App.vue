<template>
  <div class="container my-5">
    <div class="row">
      <div class="col-md-3">
        <with-input />
      </div>

      <div class="col-md-3">
        <user-composable />
      </div>

      <div class="col-md-3">
        <normal-usage />
      </div>

      <div class="col-md-3">
        <abnormal-usage />
      </div>

      <div class="col-md-3">
        <with-watch />
      </div>

      <div class="col-md-3">
        <from-pinia />
      </div>

      <div class="col-md-3">
        <query-tests />
      </div>

      <div class="col-md-3">
        <Suspense>
          <AsyncWithSuspense class="my-3" />

          <template #fallback>
            Loading...
          </template>
        </Suspense>
      </div>

      <div class="col-md-3">
        <Suspense>
          <AsyncImmediateSuspense />

          <template #fallback>
            Loading...
          </template>
        </Suspense>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import AbnormalUsage from './components/AbnormalUsage.vue'
import FromPinia from './components/FromPinia.vue'
import NormalUsage from './components/NormalUsage.vue'
import UserComposable from './components/UserComposable.vue'
import WithInput from './components/WithInput.vue'
import WithWatch from './components/WithWatch.vue'
import QueryTests from './components/QueryTests.vue'

const AsyncWithSuspense = defineAsyncComponent({
  loader: () => import('./components/WithSuspense.vue')
})

const AsyncImmediateSuspense = defineAsyncComponent({
  loader: () => import('./components/ImmediateSuspense.vue')
})
</script>
