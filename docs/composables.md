---
outline: deep
---

Vue Axios Manager comes with several built-in composables to facilitate making requests and managing endpoints.

# Composables 🚀

### useRequest

A simple way to send requests using the configured endpoint and route:

```vue
<script setup lang="ts">
const { execute, responseData } = useRequest('myendpoint', '/v1/test')

async function testExecuteInFunction() {
  await execute()
}
</script>
```

It can also be used inside the `setup` function and triggered on mount:

```vue
<script setup lang="ts">
const { execute, responseData } = useRequest('myendpoint', '/v1/test')

onMounted(async() => {
  await execute()
})
</script>
```

To use it asynchronously with `<Suspense>`:

```vue
<template>
    <Suspense>
        <AsyncMyComponent />
    </Suspense>
</template>
```

```vue
<script setup lang="ts">
const AsyncMyComponent = defineAsyncComponent({
  loader: () => ('@/components/MyComponent.vue')
})
</script>
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

::: tip
⚠️ When specified, both the `domain` and `endpoint` path are ignored
:::

`beforeStart`

Callback executed just before the request is made

`watch`

Automatically trigger requests based on reactive value changes

### useAsynRequest

Adds a debounce layer to defer the request execution

`debounce`

Delays the execution of the request, even when triggered manually

::: info
⚠️ The debouncing is applied even if you call the request manually
:::

## More

Check out the documentation for the [full list of runtime APIs](https://vitepress.dev/reference/runtime-api#usedata).
