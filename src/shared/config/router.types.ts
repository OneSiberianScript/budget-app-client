import type { RouteRecordInfo } from 'vue-router'

/** Typed map of route names to route records. Used by vue-router for typed push/replace. */
export interface RouteNamedMap {
    accounts: RouteRecordInfo<'accounts', '/accounts', Record<never, never>, Record<never, never>, never>
    'budget-plans': RouteRecordInfo<'budget-plans', '/budget-plans', Record<never, never>, Record<never, never>, never>
    'budget-settings': RouteRecordInfo<
        'budget-settings',
        '/budgets/:id/settings',
        { id: string },
        { id: string },
        never
    >
    budgets: RouteRecordInfo<'budgets', '/budgets', Record<never, never>, Record<never, never>, never>
    categories: RouteRecordInfo<'categories', '/categories', Record<never, never>, Record<never, never>, never>
    'change-password': RouteRecordInfo<
        'change-password',
        '/profile/change-password',
        Record<never, never>,
        Record<never, never>,
        never
    >
    'confirm-email': RouteRecordInfo<
        'confirm-email',
        '/auth/confirm-email',
        Record<never, never>,
        Record<never, never>,
        never
    >
    'confirm-email-required': RouteRecordInfo<
        'confirm-email-required',
        '/confirm-email-required',
        Record<never, never>,
        Record<never, never>,
        never
    >
    home: RouteRecordInfo<'home', '/', Record<never, never>, Record<never, never>, never>
    invitation: RouteRecordInfo<'invitation', '/invitation', Record<never, never>, Record<never, never>, never>
    login: RouteRecordInfo<'login', '/auth/login', Record<never, never>, Record<never, never>, never>
    'not-found': RouteRecordInfo<
        'not-found',
        '/:pathMatch(.*)*',
        { pathMatch: string[] },
        { pathMatch: string[] },
        never
    >
    profile: RouteRecordInfo<'profile', '/profile', Record<never, never>, Record<never, never>, never>
    register: RouteRecordInfo<'register', '/auth/register', Record<never, never>, Record<never, never>, never>
    sessions: RouteRecordInfo<'sessions', '/profile/sessions', Record<never, never>, Record<never, never>, never>
    transactions: RouteRecordInfo<'transactions', '/transactions', Record<never, never>, Record<never, never>, never>
}

declare module 'vue-router' {
    interface RouteMeta {
        requiresAuth?: boolean
        layout?: string
        title?: string
        subtitle?: string
        breadcrumbParent?: string
        /** Имя родительского маршрута для кнопки «Назад» в ThePageHeader */
        parent?: string
    }
}
