<template>
  <div class="container">
    <div class="row">
      <div class="col-md-5 offset-md-3">
        <div class="card shadow-sm">
          <div class="card-body">
            <div class="alert alert-warning">
              {{ watchedResponse }}
            </div>

            <div class="alert alert-success">
              Pinia store: {{ comments }}
            </div>

            <div class="alert alert-warning">
              {{ normalUsageData }}
            </div>
          </div>
        </div>

        <div class="card shadow-sm my-2">
          <div class="card-body">
            <button class="btn btn-danger btn-rounded btn-block shadow-none" @click="testInFunction">
              Test composable in function
            </button>

            <button class="btn btn-primary btn-rounded btn-block shadow-none" @click="testExecuteInFunction">
              Test execute in function
            </button>

            <button class="btn btn-primary btn-rounded btn-block shadow-none" @click="() => count += 1">
              Test with watch
            </button>

            <button class="btn btn-warning btn-rounded btn-block shadow-none" @click="requestProtected">
              Test protected
            </button>

            <button class="btn btn-warning btn-rounded btn-block shadow-none" @click="store.handleComments">
              Test from Pinia
            </button>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <h1>Suspense</h1>
            <Suspense>
              <AsyncWithSuspense class="my-3" />

              <template #fallback>
                Loading...
              </template>
            </Suspense>

            <Suspense>
              <AsyncImmediateSuspense />

              <template #fallback>
                Loading...
              </template>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import { useRequest } from './plugins'
import { useComments } from './stores'
import { storeToRefs } from 'pinia'

const AsyncWithSuspense = defineAsyncComponent({
  loader: () => import('./components/WithSuspense.vue')
})

const AsyncImmediateSuspense = defineAsyncComponent({
  loader: () => import('./components/ImmediateSuspense.vue')
})

/**
 * Normal usage
 */
const { execute, responseData: normalUsageData } = useRequest('quart', '/v1/test')

async function testExecuteInFunction() {
  await execute()
}

/**
 * Abnormal usage: we are obliged to specify the "baseUrl"
 */
async function testInFunction() {
  const { execute } = useRequest('quart', '/v1/test')
  await execute()
}

const count = ref<number>(1)
const { responseData: watchedResponse } = useRequest('quart', '/v1/test', {
  watch: count
})

/**
 * Expect a 401 error in order to test interceptors
 */
const { execute: requestProtected } = useRequest('quart', '/v1/protected')

const store = useComments()
const { comments } = storeToRefs(store)
</script>
