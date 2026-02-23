/**
 * Формат ответа об ошибке с бэкенда: { error: { code, message } }.
 */
export interface ApiErrorBody {
    error: {
        code: string
        message: string
    }
}

/**
 * Нормализованная ошибка API для обработчиков и toast.
 * @property code - Код ошибки (UNAUTHORIZED, NETWORK_ERROR и т.д.)
 * @property message - Человекочитаемое сообщение
 */
export interface ApiError {
    code: string
    message: string
}

/**
 * Преобразует ошибку axios в ApiError. Учитывает формат бэкенда и запасное сообщение.
 * @param error - Исключение или ответ axios
 * @returns Нормализованная ошибка с полями code и message
 */
const SERVER_UNAVAILABLE_MESSAGE = 'Сервер недоступен. Попробуйте обновить страницу позже.'

export function toApiError(error: unknown): ApiError {
    const ax = error as { code?: string; response?: unknown } | null
    if (ax && typeof ax === 'object' && (ax.code === 'ECONNABORTED' || ax.code === 'ERR_NETWORK')) {
        return { code: 'NETWORK_ERROR', message: SERVER_UNAVAILABLE_MESSAGE }
    }
    if (error && typeof error === 'object' && 'response' in error) {
        const res = (error as { response?: { data?: ApiErrorBody } }).response
        const data = res?.data
        if (data?.error) {
            return { code: data.error.code, message: data.error.message }
        }
    }
    const message = error instanceof Error ? error.message : typeof error === 'string' ? error : 'Неизвестная ошибка'
    return { code: 'UNKNOWN', message }
}

/**
 * Ошибка 429 при POST /api/auth/resend-confirm-email.
 * retryAfter — секунды до возможности повторной отправки (если бэкенд вернул в теле).
 */
export class ResendConfirmEmailRateLimitError extends Error {
    constructor(public readonly retryAfter?: number) {
        super('Слишком частый запрос')
        this.name = 'ResendConfirmEmailRateLimitError'
    }
}
