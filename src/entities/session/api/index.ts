import { request } from '@/shared/api/request'
import type {
    AuthLoginResponse,
    AuthRefreshResponse,
    AuthRegisterResponse,
    AuthUser,
    SessionInfo
} from '@/shared/types'

/** Ответ login: бэкенд может дополнительно вернуть user */
export type LoginResponse = AuthLoginResponse & { user?: AuthUser }

/**
 * Вход. При успехе возвращает accessToken, sessionId и опционально user.
 * @param email - Email
 * @param password - Пароль
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
    return request<LoginResponse>({
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
 * Возвращает новый accessToken и sessionId (user не возвращается — хранимый в store не трогаем).
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
