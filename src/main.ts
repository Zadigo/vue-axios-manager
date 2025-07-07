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
      domain: import.meta.env.VITE_QUART_DEV,
      port: '5000'
    }
  ]
}))

app.mount('#app')
