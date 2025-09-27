---
outline: deep
---

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

## Plugin options

`name`

Unique identifier for the endpoint, used in the composable call

`dev`

Domain used __exclusively__ in development mode

::: warning
⚠️ Must be a domain only (e.g., `example.com`). Do __not__ include protocol (`http://`) or paths
:::

`domain`

Domain used in production mode

::: info
✅ Must include protocol (e.g., `https://api.example.com`).
:::

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

::: info
✅ When a `401 Unauthorized` error occurs and both `accessEndpoint` and `refreshEndpoint` are defined, Vue Axios Manager automatically handles token refreshing and retries the original request
:::
