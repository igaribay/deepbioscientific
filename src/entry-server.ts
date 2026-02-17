import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createHead } from '@unhead/vue/server'
import { renderSSRHead } from '@unhead/ssr'
import App from './App.vue'
import { routes } from './router/routes'

export async function render(url: string) {
  const app = createSSRApp(App)
  const head = createHead()
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })

  app.use(head)
  app.use(router)

  await router.push(url)
  await router.isReady()

  const appHtml = await renderToString(app)
  const headPayload = await renderSSRHead(head)

  return { appHtml, headPayload }
}
