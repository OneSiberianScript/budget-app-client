/** Route name constants (UPPER_SNAKE_CASE keys, kebab-case values). Use with router.push({ name: ROUTE_NAMES.X }). */
export const ROUTE_NAMES = {
    ACCOUNTS: 'accounts',
    BUDGET_PLANS: 'budget-plans',
    BUDGET_SETTINGS: 'budget-settings',
    BUDGETS: 'budgets',
    CATEGORIES: 'categories',
    CHANGE_PASSWORD: 'change-password',
    CONFIRM_EMAIL: 'confirm-email',
    CONFIRM_EMAIL_REQUIRED: 'confirm-email-required',
    HOME: 'home',
    INVITATION: 'invitation',
    LOGIN: 'login',
    NOT_FOUND: 'not-found',
    PROFILE: 'profile',
    REGISTER: 'register',
    SESSIONS: 'sessions',
    TRANSACTIONS: 'transactions'
} as const

/** Route path constants (kebab-case). Use for path in routes and redirects. */
export const ROUTE_PATHS = {
    ACCOUNTS: '/accounts',
    BUDGET_PLANS: '/budget-plans',
    BUDGET_SETTINGS: '/budgets/:id/settings',
    BUDGETS: '/budgets',
    CATEGORIES: '/categories',
    CHANGE_PASSWORD: '/profile/change-password',
    CONFIRM_EMAIL: '/auth/confirm-email',
    CONFIRM_EMAIL_REQUIRED: '/confirm-email-required',
    HOME: '/',
    INVITATION: '/invitation',
    LOGIN: '/auth/login',
    NOT_FOUND: '/:pathMatch(.*)*',
    PROFILE: '/profile',
    REGISTER: '/auth/register',
    SESSIONS: '/profile/sessions',
    TRANSACTIONS: '/transactions'
} as const
