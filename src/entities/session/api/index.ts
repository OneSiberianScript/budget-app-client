import { ResendConfirmEmailRateLimitError } from '@/shared/api/errors'
import { request } from '@/shared/api/request'
import type { AuthLoginResponse, AuthRefreshResponse, AuthRegisterResponse, SessionInfo, User } from '@/shared/types'

/**
 * Вход. Ответ содержит accessToken, sessionId и user (в т.ч. emailConfirmedAt).
 * @param email - Email
 * @param password - Пароль
 */
export async function login(email: string, password: string): Promise<AuthLoginResponse> {
    return request<AuthLoginResponse>({
        method: 'POST',
        url: '/auth/login',
        data: { email, password }
    })
}

/**
 * Регистрация. При успехе возвращает accessToken, sessionId и user.
 */
export async function register(payload: {
    email: string
    password: string
    firstName: string
    lastName: string
}): Promise<AuthRegisterResponse> {
    return request<AuthRegisterResponse>({
        method: 'POST',
        url: '/auth/register',
        data: payload
    })
}

/**
 * Обновление access-токена. Использует HttpOnly cookie (withCredentials).
 * По openapi ответ — только accessToken, sessionId.
 */
export async function refresh(): Promise<AuthRefreshResponse> {
    return request<AuthRefreshResponse>({
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
 * Текущий пользователь (данные авторизованного, в т.ч. emailConfirmedAt). Требуется access-токен.
 */
export async function getCurrentUser(): Promise<User> {
    return request<User>({ method: 'GET', url: '/users/me' })
}

/**
 * Повторная отправка письма с подтверждением email. При 429 бросает ResendConfirmEmailRateLimitError с retryAfter.
 */
export async function resendConfirmEmail(): Promise<void> {
    try {
        await request({
            method: 'POST',
            url: '/auth/resend-confirm-email',
            _suppressErrorNotification: true
        })
    } catch (err: unknown) {
        const res = (err as { response?: { status?: number; data?: { retryAfter?: number } } }).response
        if (res?.status === 429) {
            throw new ResendConfirmEmailRateLimitError(res.data?.retryAfter)
        }
        throw err
    }
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
export async function getSessions(): Promise<SessionInfo[]> {
    return request<SessionInfo[]>({ method: 'GET', url: '/auth/sessions' })
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
