import './assets/main.css'

import { createApp } from 'vue'
import { createHead } from '@unhead/vue/client'
import App from './App.vue'
import router from './router'

// Load Google Analytics 4 from env variable
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID
if (GA_ID && GA_ID !== 'G-XXXXXXXXXX') {
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function (...args: unknown[]) {
    window.dataLayer.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID)
}

const app = createApp(App)
const head = createHead()

app.use(head)
app.use(router)

app.mount('#app')
