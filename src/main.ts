import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createApiManager } from './plugins'

import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'mdb-ui-kit/css/mdb.min.css'
import './style.css'

const app = createApp(App)

app.use(createPinia())

app.use(createApiManager({
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

app.mount('#app')
