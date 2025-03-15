import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vuetify from './lib/vuetify'
import { VueQueryPlugin } from '@tanstack/vue-query'
import queryClient from './lib/queryClient'
import Vue3Toastify from 'vue3-toastify'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(VueQueryPlugin, {queryClient:queryClient})
app.use(Vue3Toastify, {
    autoClose: 7500,
    position: 'top-left',
    theme: 'colored',
  });

app.mount('#app')
