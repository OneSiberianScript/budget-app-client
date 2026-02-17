import { getActivePinia } from 'pinia'

import { useSessionStore } from '@/entities/session'

import { ROUTE_PATHS } from '@/shared/config/router'

import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

/**
 * Global navigation guards: sets document.title from route meta and enforces auth for protected routes.
 * @param to - Target route
 * @param _from - Source route
 * @param next - Callback to continue or redirect
 */
export function createGuards(to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) {
    const meta = to.meta
    if (meta.title && typeof document !== 'undefined') {
        document.title = `${meta.title} | Budget App`
    }
    const requiresAuth = meta.requiresAuth === true
    if (requiresAuth) {
        const pinia = getActivePinia()
        if (pinia) {
            const sessionStore = useSessionStore(pinia)
            if (!sessionStore.isAuthenticated) {
                next({ path: ROUTE_PATHS.LOGIN, query: to.query })
                return
            }
        }
    }
    next()
}
