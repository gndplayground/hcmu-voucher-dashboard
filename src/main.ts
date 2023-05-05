import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'

import App from './App.vue'
import router from './router'

import 'gardevoir/dist/index.css'
import './assets/main.css'

const app = createApp(App)

app.use(VueQueryPlugin)

// app.config.errorHandler = (err, vm, info) => {
//   console.error(err, vm, info)
// }

app.use(createPinia())
app.use(router)

app.mount('#app')
