# Axios Api Manager

This package is used to create multiple api endpoints with axios with the ability to
send a request to one or multiple requests at a time.

## Installation

```typescript
pnpm i @axios-api
```

Register your in your Vue application:

```typescript
import { createApiManager } from './plugins'

app.use(createApiManager([
  {
    name: 'test',
    port: '8005'
  },
  {
    name: 'another',
    port: '8000'
  }
]))
```

### Composables

```typescript
const { get } = useRequest<Google>('test', '/api/v1/test')
```

```typescript
const { get } = useRequest<Google>('test', '/api/v1/test', {
    completed(response) {
        // Do something
    },
    beforeStart() {
        // Do something
    }
})
```
