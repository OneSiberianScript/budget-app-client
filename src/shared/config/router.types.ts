import type { RouteRecordInfo } from 'vue-router'

export interface RouteNamedMap {
    login: RouteRecordInfo<'login', '/auth/login', Record<never, never>, Record<never, never>, never>
    register: RouteRecordInfo<'register', '/auth/register', Record<never, never>, Record<never, never>, never>
    home: RouteRecordInfo<'home', '/', Record<never, never>, Record<never, never>, never>
}
