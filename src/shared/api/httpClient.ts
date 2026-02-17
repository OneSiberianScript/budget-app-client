import axios, { type InternalAxiosRequestConfig } from 'axios'
import { getActivePinia } from 'pinia'
import { apiConfig } from './config'
import { toApiError } from './errors'
import { useSessionStore } from '@/entities/session/model/store'
import type { SessionUser } from '@/entities/session/model/types'

/** Extended config for our interceptors */
export interface RequestConfig extends InternalAxiosRequestConfig {
    _suppressErrorNotification?: boolean
    _isRetry?: boolean
}

const withCredentials = true

/** Axios instance used only for POST /auth/refresh to avoid 401 interceptor recursion */
const refreshClient = axios.create({
    baseURL: apiConfig.baseURL,
    timeout: apiConfig.timeout,
    withCredentials
})

/**
 * Main HTTP client: Bearer token, 401 → refresh → retry, toast on error (unless _suppressErrorNotification).
 */
export const httpClient = axios.create({
    baseURL: apiConfig.baseURL,
    timeout: apiConfig.timeout,
    withCredentials
})

/** Pending refresh promise so concurrent 401s share one refresh */
let refreshPromise: Promise<boolean> | null = null

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

            if (!refreshPromise) {
                refreshPromise = (async () => {
                    try {
                        const { data } = await refreshClient.post<{ accessToken: string; user: SessionUser }>(
                            '/auth/refresh'
                        )
                        sessionStore.setSession(data.accessToken, data.user)
                        return true
                    } catch {
                        sessionStore.clearSession()
                        if (typeof window !== 'undefined') {
                            window.location.href = '/auth/login'
                        }
                        return false
                    } finally {
                        refreshPromise = null
                    }
                })()
            }

            const refreshed = await refreshPromise
            if (refreshed) {
                originalConfig._isRetry = true
                return httpClient(originalConfig)
            }
            return Promise.reject(error)
        }

        if (!originalConfig._suppressErrorNotification) {
            const apiErr = toApiError(error)
            // Toast: use ant-design-vue message when available
            if (typeof window !== 'undefined' && (window as unknown as { __ANTD_MESSAGE__?: { error: (m: string) => void } }).__ANTD_MESSAGE__) {
                (window as unknown as { __ANTD_MESSAGE__: { error: (m: string) => void } }).__ANTD_MESSAGE__.error(apiErr.message)
            } else {
                console.error(apiErr.message)
            }
        }

        return Promise.reject(error)
    }
)
