import { request } from '@/shared/api/request'

import type { AuthSession, SessionUser } from '../model/types'

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

/**
 * Подтверждение email по токену из письма.
 */
export async function confirmEmail(token: string): Promise<void> {
    await request({
        method: 'POST',
        url: '/auth/confirm-email',
        data: { token }
    })
}

/**
 * Смена пароля (защищённый эндпоинт).
 */
export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await request({
        method: 'POST',
        url: '/auth/change-password',
        data: { currentPassword, newPassword }
    })
}

/**
 * Список сессий пользователя.
 */
export async function getSessions(): Promise<AuthSession[]> {
    return request<AuthSession[]>({ method: 'GET', url: '/auth/sessions' })
}

/**
 * Завершить одну сессию по id.
 */
export async function revokeSession(sessionId: string): Promise<void> {
    await request({ method: 'DELETE', url: `/auth/sessions/${sessionId}` })
}

/**
 * Завершить все сессии кроме текущей.
 */
export async function revokeAllSessions(): Promise<void> {
    await request({ method: 'DELETE', url: '/auth/sessions' })
}
