import { getActivePinia } from 'pinia'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { ROUTE_PATHS } from '@/shared/config/router'
import { useSessionStore } from '@/entities/session'

export interface RouteMeta {
    requiresAuth?: boolean
    layout?: string
    title?: string
    subtitle?: string
    breadcrumbParent?: string
}

export function createGuards(
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext
) {
    const meta = to.meta as RouteMeta
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
