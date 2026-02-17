/**
 * Backend error response shape: { error: { code: string, message: string } }
 */
export interface ApiErrorBody {
    error: {
        code: string
        message: string
    }
}

/**
 * Normalized API error for handlers and toast.
 */
export interface ApiError {
    code: string
    message: string
}

/**
 * Parses axios error response into ApiError. Handles backend format and fallback message.
 */
export function toApiError(error: unknown): ApiError {
    if (error && typeof error === 'object' && 'response' in error) {
        const res = (error as { response?: { data?: ApiErrorBody } }).response
        const data = res?.data
        if (data?.error) {
            return { code: data.error.code, message: data.error.message }
        }
    }
    const message =
        error instanceof Error ? error.message : typeof error === 'string' ? error : 'Неизвестная ошибка'
    return { code: 'UNKNOWN', message }
}
