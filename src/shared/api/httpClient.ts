import axios, { type InternalAxiosRequestConfig } from 'axios'
import { getActivePinia } from 'pinia'

import { useSessionStore } from '@/entities/session/model/store'
import type { AuthUser } from '@/entities/session/model/types'

import { getMessage } from '@/shared/lib/message'

import { apiConfig } from './config'
import { toApiError } from './errors'

function isNetworkError(error: unknown): boolean {
    const ax = error as { code?: string } | null
    return !!ax && typeof ax === 'object' && (ax.code === 'ECONNABORTED' || ax.code === 'ERR_NETWORK')
}

/**
 * Расширенная конфигурация запроса для перехватчиков.
 * @property _suppressErrorNotification - Не показывать toast при ошибке
 * @property _isRetry - Признак повторного запроса после refresh
 */
export interface RequestConfig extends InternalAxiosRequestConfig {
    _suppressErrorNotification?: boolean
    _isRetry?: boolean
}

const withCredentials = true

/** Отдельный axios-инстанс только для POST /auth/refresh, чтобы избежать рекурсии при 401 */
const refreshClient = axios.create({
    baseURL: apiConfig.baseURL,
    timeout: apiConfig.timeout,
    withCredentials
})

/**
 * Основной HTTP-клиент: подставляет Bearer-токен, при 401 обновляет токен и повторяет запрос,
 * при ошибке показывает toast (если в конфиге не задано _suppressErrorNotification).
 */
export const httpClient = axios.create({
    baseURL: apiConfig.baseURL,
    timeout: apiConfig.timeout,
    withCredentials
})

/** Pending refresh promise so concurrent 401s share one refresh. Resolves with { ok, error? } to distinguish network vs 401/403. */
let refreshPromise: Promise<{ ok: boolean; error?: unknown }> | null = null

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const pinia = getActivePinia()
    if (pinia) {
        const store = useSessionStore(pinia)
        const token = store.accessToken
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
    }
    return config
})

httpClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalConfig = error.config as RequestConfig | undefined
        if (!originalConfig) {
            return Promise.reject(error)
        }

        const isRefreshRequest = originalConfig.url?.includes('/auth/refresh')
        const isRetry = originalConfig._isRetry === true

        if (error.response?.status === 401 && !isRefreshRequest && !isRetry) {
            const pinia = getActivePinia()
            if (!pinia) {
                return Promise.reject(error)
            }
            const sessionStore = useSessionStore(pinia)

            if (sessionStore.restorePromise !== null) {
                return Promise.reject(error)
            }

            if (!refreshPromise) {
                refreshPromise = (async (): Promise<{ ok: boolean; error?: unknown }> => {
                    try {
                        const { data } = await refreshClient.post<{
                            accessToken: string
                            sessionId: string
                            user?: AuthUser
                        }>('/auth/refresh')
                        if (data.user) {
                            sessionStore.setSession(data.accessToken, data.user, data.sessionId)
                        } else {
                            sessionStore.setAccessToken(data.accessToken, data.sessionId)
                        }
                        return { ok: true }
                    } catch (err) {
                        return { ok: false, error: err }
                    } finally {
                        refreshPromise = null
                    }
                })()
            }

            const result = await refreshPromise
            if (result.ok) {
                originalConfig._isRetry = true
                return httpClient(originalConfig)
            }
            const msg = getMessage()
            if (msg) {
                msg.error(
                    isNetworkError(result.error) ? 'Нет сети. Проверьте подключение.' : 'Сессия истекла. Войдите снова.'
                )
            }
            ;(error as Error & { _sessionExpired?: boolean })._sessionExpired = true
            sessionStore.clearSession()
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/login'
            }
            return Promise.reject(error)
        }

        if (!originalConfig._suppressErrorNotification) {
            const apiErr = toApiError(error)
            const msg = getMessage()
            if (msg) {
                msg.error(apiErr.message)
            } else {
                console.error(apiErr.message)
            }
        }

        return Promise.reject(error)
    }
)
