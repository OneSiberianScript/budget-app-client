import { request } from '@/shared/api/request'
import type { SessionUser } from '../model/types'

/** Response shape from login/register/refresh */
export interface AuthResponse {
    accessToken: string
    user: SessionUser
}

/**
 * Login. On success returns accessToken and user.
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
    return request<AuthResponse>({
        method: 'POST',
        url: '/auth/login',
        data: { email, password }
    })
}

/**
 * Register. On success returns accessToken and user.
 */
export async function register(payload: {
    email: string
    password: string
    firstName: string
    lastName: string
}): Promise<AuthResponse> {
    return request({
        method: 'POST',
        url: '/auth/register',
        data: payload
    })
}

/**
 * Refresh access token. Uses HttpOnly cookie (send with credentials). Returns new accessToken and user.
 */
export async function refresh(): Promise<AuthResponse> {
    return request<AuthResponse>({
        method: 'POST',
        url: '/auth/refresh',
        _suppressErrorNotification: true
    })
}

/**
 * Logout. Clears refresh token cookie on backend when sent with credentials.
 */
export async function logout(): Promise<void> {
    await request({
        method: 'POST',
        url: '/auth/logout',
        _suppressErrorNotification: true
    })
}
