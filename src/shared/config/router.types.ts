import type { RouteRecordInfo } from 'vue-router'

/** Typed map of route names to route records. Used by vue-router for typed push/replace. */
export interface RouteNamedMap {
    home: RouteRecordInfo<'home', '/', Record<never, never>, Record<never, never>, never>
    login: RouteRecordInfo<'login', '/auth/login', Record<never, never>, Record<never, never>, never>
    'not-found': RouteRecordInfo<
        'not-found',
        '/:pathMatch(.*)*',
        { pathMatch: string[] },
        { pathMatch: string[] },
        never
    >
    register: RouteRecordInfo<'register', '/auth/register', Record<never, never>, Record<never, never>, never>
}

declare module 'vue-router' {
    interface RouteMeta {
        requiresAuth?: boolean
        layout?: string
        title?: string
        subtitle?: string
        breadcrumbParent?: string
    }
}
