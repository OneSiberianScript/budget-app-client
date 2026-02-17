import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { createGuards } from './guards'

export const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    }
})

router.beforeEach(createGuards)
