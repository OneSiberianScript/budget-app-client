import { ROUTE_NAMES, ROUTE_PATHS } from '@/shared/config/router'

export default [
    {
        path: ROUTE_PATHS.LOGIN,
        name: ROUTE_NAMES.LOGIN,
        component: () => import('@/pages/auth/ui/LoginPage.vue'),
        meta: { requiresAuth: false, layout: 'auth', title: 'Вход' }
    },
    {
        path: ROUTE_PATHS.REGISTER,
        name: ROUTE_NAMES.REGISTER,
        component: () => import('@/pages/auth/ui/RegisterPage.vue'),
        meta: { requiresAuth: false, layout: 'auth', title: 'Регистрация' }
    },
    {
        path: ROUTE_PATHS.CONFIRM_EMAIL,
        name: ROUTE_NAMES.CONFIRM_EMAIL,
        component: () => import('@/pages/auth/ui/ConfirmEmailPage.vue'),
        meta: { requiresAuth: false, layout: 'auth', title: 'Подтверждение email' }
    },
    {
        path: ROUTE_PATHS.HOME,
        name: ROUTE_NAMES.HOME,
        component: () => import('@/pages/home/ui/HomePage.vue'),
        meta: { requiresAuth: true, layout: 'main', title: 'Дашборд' }
    },
    {
        path: ROUTE_PATHS.CATEGORIES,
        name: ROUTE_NAMES.CATEGORIES,
        component: () => import('@/pages/categories/ui/CategoriesPage.vue'),
        meta: { requiresAuth: true, layout: 'main', title: 'Категории' }
    },
    {
        path: ROUTE_PATHS.ACCOUNTS,
        name: ROUTE_NAMES.ACCOUNTS,
        component: () => import('@/pages/accounts/ui/AccountsPage.vue'),
        meta: { requiresAuth: true, layout: 'main', title: 'Счета' }
    },
    {
        path: ROUTE_PATHS.BUDGETS,
        name: ROUTE_NAMES.BUDGETS,
        component: () => import('@/pages/budgets/ui/BudgetsPage.vue'),
        meta: { requiresAuth: true, layout: 'main', title: 'Бюджеты' }
    },
    {
        path: ROUTE_PATHS.BUDGET_SETTINGS,
        name: ROUTE_NAMES.BUDGET_SETTINGS,
        component: () => import('@/pages/budget-settings/ui/BudgetSettingsPage.vue'),
        meta: { requiresAuth: true, layout: 'main', title: 'Настройки бюджета' }
    },
    {
        path: ROUTE_PATHS.INVITATION,
        name: ROUTE_NAMES.INVITATION,
        component: () => import('@/pages/invitation/ui/IncomingInvitationPage.vue'),
        meta: { requiresAuth: false, layout: 'auth', title: 'Приглашение в бюджет' }
    },
    {
        path: ROUTE_PATHS.BUDGET_PLANS,
        name: ROUTE_NAMES.BUDGET_PLANS,
        component: () => import('@/pages/budget-plans/ui/BudgetPlansPage.vue'),
        meta: { requiresAuth: true, layout: 'main', title: 'Планы по бюджету' }
    },
    {
        path: ROUTE_PATHS.TRANSACTIONS,
        name: ROUTE_NAMES.TRANSACTIONS,
        component: () => import('@/pages/transactions/ui/TransactionsPage.vue'),
        meta: { requiresAuth: true, layout: 'main', title: 'Транзакции' }
    },
    {
        path: ROUTE_PATHS.PROFILE,
        name: ROUTE_NAMES.PROFILE,
        component: () => import('@/pages/profile/ui/ProfilePage.vue'),
        meta: { requiresAuth: true, layout: 'main', title: 'Профиль' }
    },
    {
        path: ROUTE_PATHS.CHANGE_PASSWORD,
        name: ROUTE_NAMES.CHANGE_PASSWORD,
        component: () => import('@/pages/profile/ui/ChangePasswordPage.vue'),
        meta: { requiresAuth: true, layout: 'main', title: 'Смена пароля' }
    },
    {
        path: ROUTE_PATHS.SESSIONS,
        name: ROUTE_NAMES.SESSIONS,
        component: () => import('@/pages/profile/ui/SessionsPage.vue'),
        meta: { requiresAuth: true, layout: 'main', title: 'Сессии' }
    },
    {
        path: ROUTE_PATHS.NOT_FOUND,
        name: ROUTE_NAMES.NOT_FOUND,
        component: () => import('@/pages/not-found/ui/NotFoundPage.vue'),
        meta: { requiresAuth: false, layout: 'main', title: 'Страница не найдена' }
    }
]
