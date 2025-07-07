<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <button class="btn btn-primary btn-rounded btn-block" @click="testInFunction">
              Test composable in function
            </button>

            <button class="btn btn-primary btn-rounded btn-block" @click="testExecuteInFunction">
              Test execute in function
            </button>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <TestComposables />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRequest } from './plugins'

import TestComposables from './components/TestComposables.vue'

/**
 * Normal usage
 */
const { execute } = useRequest('quart', '/v1/test')

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
</script>
