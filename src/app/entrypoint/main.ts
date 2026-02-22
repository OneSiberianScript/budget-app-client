import Antd from 'ant-design-vue'
import { PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import 'ant-design-vue/dist/reset.css'
import 'vue-echarts/csp/style.css'

import App from '@/app/App.vue'
import { router } from '@/app/providers/router'

import '@/app/styles/style.css'
import { useBudgetStore } from '@/entities/budget'
import { useSessionStore } from '@/entities/session'

use([CanvasRenderer, PieChart, GridComponent, TooltipComponent, LegendComponent])
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(Antd)

const sessionStore = useSessionStore()
const budgetStore = useBudgetStore()
budgetStore.hydrateFromStorage()
;(async () => {
    await sessionStore.restoreSession()
    await router.isReady()
    app.mount('#app')
})()
