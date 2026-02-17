import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
// ECharts: use 'vue-echarts/csp/style.css' when using v-chart component
import { router } from '@/app/providers/router'
import App from '@/app/App.vue'
import '@/app/styles/style.css'
import { useSessionStore } from '@/entities/session'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(Antd)

const sessionStore = useSessionStore()
sessionStore.hydrateFromStorage()

router.isReady().then(() => {
    app.mount('#app')
})
