# Vue Axios Manager

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

__Vue Axios Manager__ is a lightweight plugin that enables you to manage multiple Axios endpoints in any Vue application with ease and clarity.

## Why use Vue Axios Manager ❓

In larger Vue applications, it's common to have multiple API endpoints 
scattered throughout the codebase. Vue Axios Manager consolidates all your endpoints into a single, 
centralized configuration and provides simple composables to invoke them consistently.

## Features ✨

- ⛰ Vue 3 ready
- ✨ Centralizes all API endpoints via intuitive [composables](#composables)
- 🔑 Built-in support for __automatic access and refresh token handling__

## 👉🏽 [Demo with Vue 3 on StackBlitz](https://stackblitz.com/github/piniajs/example-vue-3-vite)

## Installation 🏠

```typescript
npm i @vue-axios-manager
```

Or,

```typescript
pnpm i @vue-axios-manager
```

Then register the plugin in your Vue application:

```typescript
import { createApiManager } from './plugins'

app.use(createVueAxiosManager({
  endpoints: [
    {
      name: 'quart',
      dev: import.meta.env.VITE_QUART_DEV,
      port: '5000',
      domain: 'http://example.com',
      https: false,
      accessEndpoint: '/v1/token',
      refreshEnpoint: '/v1/refresh-token',
      label: 'MyLabel',
      axios: {
        withCredentials: true,
        timeout: 20000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    },
    {
      name: 'comments',
      dev: 'jsonplaceholder.typicode.com',
      https: true
    }
  ]
}))
```

__Plugin options__

`name`

Unique identifier for the endpoint, used in the composable call

`dev`

Domain used __exclusively__ in development mode

> [!NOTE]
> ⚠️ Must be a domain only (e.g., `example.com`). Do __not__ include protocol (`http://`) or paths

`domain`

Domain used in production mode

> [!NOTE]
> ✅ Must include protocol (e.g., `https://api.example.com`).

`https`

Boolean indicating whether to use HTTPS in development

`accessEndpoint`

API route used to request an access token

`refreshEnpoint`

API route used to refresh an access token

`label`

Additional configuration options for the Axios instance

`axios`

Additional configuration options for the Axios instance

`accessKey`

The name of the cookie key from which the access token will be read and used to authenticate requests

`refreshKey`

The name of the cookie key that stores the refresh token, used when refreshing the access token

`bearer`

The authorization scheme to use in the `Authorization` header (e.g., `"Bearer"`, `"Token"`, etc.). This value will prefix the access token like so:
`Authorization: <bearer> <access-token>`

### Access Token and Refresh Token Management 🔑

> [!NOTE]
> ✅ When a `401 Unauthorized` error occurs and both `accessEndpoint` and `refreshEndpoint` are defined, Vue Axios Manager automatically handles token refreshing and retries the original request

## Composables 🚀

### useRequest

A simple way to send requests using the configured endpoint and route:

```html
<script setup lang="ts">
const { execute, responseData } = useRequest('myendpoint', '/v1/test')

async function testExecuteInFunction() {
  await execute()
}
</script>
```

It can also be used inside the `setup` function and triggered on mount:

```html
<script setup lang="ts">
const { execute, responseData } = useRequest('myendpoint', '/v1/test')

onMounted(async() => {
  await execute()
})
</script>
```

To use it asynchronously with `<Suspense>`:

```html
<Suspense>
  <AsyncMyComponent />
</Suspense>
<template>
```

```html
<script setup lang="ts">
const AsyncMyComponent = defineAsyncComponent({
  loader: () => ('@/components/MyComponent.vue')
})
</scrip>
```

__composable options__

`method`

HTTP method to use (default: `"GET"`)

`query`

Optional query parameters appended to the request URL

`body`

Data payload for `POST`, `PUT`, or `PATCH` requests.

`baseUrl`

Override the configured domain entirely

> [!NOTE]
> ⚠️ When specified, both the `domain` and `endpoint` path are ignored

`beforeStart`

Callback executed just before the request is made

`watch`

Automatically trigger requests based on reactive value changes

### useAsynRequest

Adds a debounce layer to defer the request execution

`debounce`

Delays the execution of the request, even when triggered manually

> [!NOTE]
> ⚠️ The debouncing is applied even if you call the request manually

## Contributing 🙏

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```
</details>

## Thanks 🌸
