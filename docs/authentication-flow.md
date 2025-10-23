---
outline: deep
---

The access and refresh token workflow gets triggered only if an access/refresh tokens are found in the cookies.
Whenever a 401 Unauthorized error is encountered, Vue Axios Manager automatically attempts to refresh the access token.

For instance, you can login a user:

```vue
<script setup lang="ts">
import { useCookies } from '@vueuse/integrations/useCookies'

const access = useCookies('access')
const { execute, responseData } = useRequest('myendpoint', '/v1/login')

async function login() {
  await execute()
  access.value = responseData.value.access
}
</script>
```

And once the access token is set in the cookies, VueAxiosManager will automatically pick up the token and
include it in the `Authorization` header for subsequent requests whenever a 401 Unauthorized error is encountered.

