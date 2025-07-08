# Vue Axios Manager

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Vue Axios Manager is a simple plugin that allows you to create and mange multiple endpoints with Axios
in any Vue application

## Why use Vue Axos Manager

Sometimes a Vue application can have multiple endpoints which often times can be
dispersed within your application. Vue Axios Manager centralize all of them in one
area and allows their invokation with simple composables.

## Features ✨

- ⛰ Vue 3 ready
- ✨ Centralize your API endpoints with [composables](#sending-requests) and built in [components](#sending-requests)

## Installation

```typescript
pnpm i @vue-axios-manager
```

Then register the plugin in your in your Vue application:

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

### Plugin options

`name`

The name of the endpoint which will be used to call the url in the compsable

`dev`

A domain used __only__ in developement mode

> [NOTE]
> The value should be domain ex. `example.com` without the protocole. Therefore `http://example.com` will raise an error
> Paths are not accepted and will create url malformation

`domain`

This is the url that will be used exclusively in production

> [NOTE]
> `domain` accepts the protocole value

`https`

Whether to use the development domain with `https`

`accessEndpoint`

If specified, this is the endpoint used to request an access token from your api endpoint

`refreshEnpoint`

If specified, this is the endpoint used to request an access token from your api endpoint

`label`

Label for the endpoint in the devtools manager

`axios`

Extra options to pass to the axios instance

## Composables 🚀

### useRequest

The simple way to send a request is to call the endpoint name followed by its path:

```html
<script setup lang="ts">
const { execute, responseData } = useRequest('myendpoint', '/v1/test')

async function testExecuteInFunction() {
  await execute()
}
</script>
```

It can also be called directly in the setup script in a component:
```html
<script setup lang="ts">
const { execute, responseData } = useRequest('myendpoint', '/v1/test')

onMounted(async() => {
  await execute()
})
</script>
```

And then called in the parent page with `Suspense`:

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

#### Composable options

`method`

The method to use for the request

> [NOTE]
> The default method is "GET"

`query`

Send url query with with url of the request

`body`

Send data with the body of the post request

`baseUrl`

Overrides the initial domain written on the endpoint all together

> [!NOTE]
> Both the `domain` and the `path` registered on the composable are ignored when this option is specified

`beforeStart`

Callback function called before the request is executed

`watch`

You execute the function based the change of the value of a parameter with `watch`

### useAsynRequest

This composable adds an extra layer of debouncing the request to a latter stage

`debounce`

You can delay the call of the request with the `debounce` attribute of the composable.

> [NOTE]
> The debouncing is applied even if you call the request manually

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
