<template>
  <div class="card">
    <div class="card-body">
      <p>Access Token: {{ access }}</p>
      <p>User ID: {{ id }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAccessToken, useUser } from '../../src/lib/composables'

/**
 * A simple component to test useUser and useAccessToken composables
 */

const { access } = useAccessToken()
const { id } = useUser<{ user_id: string }>('user_id')
</script>
