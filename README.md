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

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

## Features ✨

- ⛰ Vue 3 ready
- ✨ Centralizes all API endpoints via intuitive [composables](##composables)
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
      label: 'MyLabel',
      dev: import.meta.env.VITE_QUART_DEV,
      port: '5000',
      domain: 'http://example.com',
      accessEndpoint: '/v1/token',
      refreshEnpoint: '/v1/refresh-token',
      https: false,
      accessKey: 'some-access-key-name',
      refreshKey: 'some-refresh-key-name',
      disableAccess: false,
      disableRefresh: false,
      axios: {
        withCredentials: true,
        timeout: 20000,
        headers: {
          'Content-Type': 'application/json'
        }
      },
      bearer: 'Token',
      disableAuth: false
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

__Endpoint options__

Descriptive list of options used for the endpoint parameter:

`name`

Unique name used to identify the endpoint to be called

`label`

Additonal descriptive label for the endpoint

`dev`

Domain used for the endpoint.

> [!NOTE]
> ⚠️ Must be a domain only (e.g., `example.com`). Do __not__ include protocol (`http://`) or paths

> [!NOTE]
> ⚠️ If `dev` is defined alone, only the value in `dev` will be used for the base domain. If `port`
> defined alone, the final domain will be `127.0.0.1:port`. In that case you only need to specify `dev` or `port`
> and not both at the same time.

`port`

Domains generally have a port. The default one is 8000

`domain`

Domain to use in a producton context

`accessEndpoint`

Path used to generated an access token

`refreshEnpoint`

Path used to generated an refresh token

`https`

Whether to use the development domain in https

`accessKey`

Unique identifier under which to store the access token

`refreshKey`

Unique identifier under which to store the refresh token

`disableAccess`

Whether to disable access token

`disableRefresh`

Whether to disable refresh token

`axios`

Options passed directly to Axios

`bearer`

The key to use in the Authorization header

`disableAuth`

Whether to disable authentication entirely

### Access Token and Refresh Token Management 🔑

The access and refresh token workflow work only if an access/refresh tokens are found in the cookies.
Whenever a 401 Unauthorized error is encountered, Vue Axios Manager automatically attempts to refresh the access token.

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
<template>
  <Suspense>
    <AsyncMyComponent />
  </Suspense>
</template>
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

Overrides the configured domain for the endpoint entirely

> [!NOTE]
> ⚠️ When specified, both the `domain` and `dev` values are ignored

`beforeStart`

Callback executed just before the request is made

`completed`

Hook used after the request is completed

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
