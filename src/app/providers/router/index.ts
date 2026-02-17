import { createRouter, createWebHistory } from 'vue-router'

import { createGuards } from './guards'
import routes from './routes'

export const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    }
})

router.beforeEach(createGuards)
