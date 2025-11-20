<template>
  <button class="btn btn-warning btn-rounded btn-block shadow-none" @click="requestProtected">
    Test protected
  </button>

  <button class="btn btn-warning btn-rounded btn-primary btn-block shadow-none" @click="testPostRequest">
    Test Post
  </button>

  <button class="btn btn-danger btn-rounded btn-primary btn-block shadow-none" @click="testAuthenticted">
    Test Authenticated View
  </button>
</template>

<script lang="ts" setup>
import { useRequest } from '../../src/lib/composables'

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
</script>
