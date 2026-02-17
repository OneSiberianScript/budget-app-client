import Antd from 'ant-design-vue'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import 'ant-design-vue/dist/reset.css'
// ECharts: use 'vue-echarts/csp/style.css' when using v-chart component
import App from '@/app/App.vue'
import { router } from '@/app/providers/router'

import '@/app/styles/style.css'
import { useBudgetStore } from '@/entities/budget'
import { useSessionStore } from '@/entities/session'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(Antd)

const sessionStore = useSessionStore()
sessionStore.hydrateFromStorage()

const budgetStore = useBudgetStore()
budgetStore.hydrateFromStorage()
;(async () => {
    await router.isReady()
    app.mount('#app')
})()
