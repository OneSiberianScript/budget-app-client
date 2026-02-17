import { createRouter, createWebHistory } from 'vue-router'

import { createGuards } from './guards'
import routes from './routes'

/** Vue Router instance: web history, scroll to top on navigate, auth + title guards. */
export const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    }
})

router.beforeEach(createGuards)
