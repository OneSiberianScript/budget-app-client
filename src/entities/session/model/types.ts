/** User data returned after login/register/refresh */
export interface SessionUser {
    id: string
    email: string
    firstName?: string
    lastName?: string
}

/** Сессия пользователя (элемент списка GET /auth/sessions) */
export interface AuthSession {
    id: string
    deviceInfo?: string
    createdAt: string
    current?: boolean
}
