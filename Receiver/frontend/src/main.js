import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())

// The mock backend is loaded dynamically so that neither the mock data nor
// axios-mock-adapter ends up in the production bundle. Mocks are installed on
// the shared axios instance before the app mounts, i.e. before any component
// issues a request.
async function start() {
  if (import.meta.env.DEV) {
    console.log('Development mode, mocking http requests')
    const { initializeMocks, initializeMockWebServer } = await import('./api/mock')
    initializeMocks()
    initializeMockWebServer()
  }

  app.mount('#app')
}

start()
