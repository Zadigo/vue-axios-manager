<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <with-input />
      </div>
    </div>

    <div class="row">
      <div class="col-sm-12 col-md-5 offset-md-3 mb-2">
        <user-composable />
      </div>
    </div>

    <div class="row">
      <div class="col-md-5 offset-md-3">
        <!-- Store + Watch -->
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

        <!-- Manual Calls -->
        <div class="card shadow-sm my-2">
          <div class="card-body">
            <button class="btn btn-info btn-rounded btn-block shadow-none" @click="testExecuteInFunction">
              Normal usage
            </button>

            <button class="btn btn-info btn-rounded btn-block shadow-none" @click="testInFunction">
              Abnormal usage
            </button>
            
            <button class="btn btn-warning btn-rounded btn-block shadow-none" @click="store.handleComments">
              Test from Pinia
            </button>

            <hr>

            <button class="btn btn-primary btn-rounded btn-block shadow-none" @click="() => updateCount()">
              Test with watch
            </button>

            <hr>

            <button class="btn btn-warning btn-rounded btn-block shadow-none" @click="requestProtected">
              Test protected
            </button>

            <button class="btn btn-warning btn-rounded btn-primary btn-block shadow-none" @click="testPostRequest">
              Test Post
            </button>

            <button class="btn btn-danger btn-rounded btn-primary btn-block shadow-none" @click="testAuthenticted">
              Test Authenticated View
            </button>
          </div>
        </div>

        <!-- Async Calls -->
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
import { useCounter, useUrlSearchParams } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { defineAsyncComponent } from 'vue'
import { useRequest } from '../src/lib/composables'
import UserComposable from './components/UserComposable.vue'
import WithInput from './components/WithInput.vue'
import { useComments } from './stores'

const AsyncWithSuspense = defineAsyncComponent({
  loader: () => import('./components/WithSuspense.vue')
})

const AsyncImmediateSuspense = defineAsyncComponent({
  loader: () => import('./components/ImmediateSuspense.vue')
})

/**
 * Normal usage
 * @description The composable is used at the top level of the script setup
 */

const { execute, responseData: normalUsageData } = useRequest('quart', '/v1/test')

async function testExecuteInFunction() {
  await execute()
}

/**
 * Abnormal usage
 * @description The composable is used inside a function. We are obliged to specify the "baseUrl"
 */

async function testInFunction() {
  const { execute } = useRequest('quart', '/v1/test', {
    // baseUrl: 'http://127.0.0.1:5001'
  })
  await execute()
}

/**
 * Usage with watch
 * @description When the watch changes, the request should be re-executed
 */

const { count, inc } = useCounter(1)
const queryParams = useUrlSearchParams('history') as { count: string }

const { responseData: watchedResponse } = useRequest('quart', '/v1/test', {
  watch: [count]
})

function updateCount() {
  inc()
  queryParams.count = count.value.toString()
}

/**
 * Expect a 401 error in order to test interceptors
 * @description Forces a 401 error. This should then trigger the refresh authentication interceptors
 */

const { execute: requestProtected } = useRequest('quart', '/v1/protected')

/**
 * POST request
 */

const { execute: testPostRequest } = useRequest('quart', '/v1/update', {
  method: 'post'
})

/**
 * Authenticated View
 */

const { execute: testAuthenticted } = useRequest('quart', '/v1/authenticated', {
  method: 'post'
})

/**
 * Pinia store
 */

const store = useComments()
const { comments } = storeToRefs(store)
</script>
