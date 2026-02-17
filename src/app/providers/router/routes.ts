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
        path: ROUTE_PATHS.HOME,
        name: ROUTE_NAMES.HOME,
        component: () => import('@/pages/home/ui/HomePage.vue'),
        meta: { requiresAuth: true, layout: 'main', title: 'Главная' }
    },
    {
        path: '/:pathMatch(.*)*',
        name: ROUTE_NAMES.NOT_FOUND,
        component: () => import('@/pages/not-found/ui/NotFoundPage.vue'),
        meta: { requiresAuth: false, layout: 'main', title: 'Страница не найдена' }
    }
]
