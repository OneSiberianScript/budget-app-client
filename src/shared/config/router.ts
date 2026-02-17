/** Route name constants (UPPER_SNAKE_CASE keys, kebab-case values). Use with router.push({ name: ROUTE_NAMES.X }). */
export const ROUTE_NAMES = {
    HOME: 'home',
    LOGIN: 'login',
    NOT_FOUND: 'not-found',
    REGISTER: 'register'
} as const

/** Route path constants (kebab-case). Use for path in routes and redirects. */
export const ROUTE_PATHS = {
    HOME: '/',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register'
} as const
