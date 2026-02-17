import { request } from '@/shared/api/request'

import type { SessionUser } from '../model/types'

/** Формат ответа login/register/refresh: токен и пользователь */
export interface AuthResponse {
    accessToken: string
    user: SessionUser
}

/**
 * Вход. При успехе возвращает accessToken и пользователя.
 * @param email - Email
 * @param password - Пароль
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
    return request<AuthResponse>({
        method: 'POST',
        url: '/auth/login',
        data: { email, password }
    })
}

/**
 * Регистрация. При успехе возвращает accessToken и пользователя.
 * @param payload - email, password, firstName, lastName
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
 * Обновление access-токена. Использует HttpOnly cookie (withCredentials). Возвращает новый accessToken и пользователя.
 */
export async function refresh(): Promise<AuthResponse> {
    return request<AuthResponse>({
        method: 'POST',
        url: '/auth/refresh',
        _suppressErrorNotification: true
    })
}

/**
 * Выход. Сбрасывает refresh-токен в cookie на бэкенде (запрос с credentials).
 */
export async function logout(): Promise<void> {
    await request({
        method: 'POST',
        url: '/auth/logout',
        _suppressErrorNotification: true
    })
}
