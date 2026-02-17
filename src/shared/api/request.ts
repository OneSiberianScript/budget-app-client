import type { AxiosRequestConfig } from 'axios'
import { httpClient } from './httpClient'

export type RequestOptions = AxiosRequestConfig & {
    _suppressErrorNotification?: boolean
}

/**
 * Typed request helper. Uses httpClient (Bearer, 401 refresh, toast on error).
 * Set _suppressErrorNotification: true to skip global error toast (e.g. refresh, logout).
 */
export async function request<T = unknown>(options: RequestOptions): Promise<T> {
    const { data } = await httpClient.request<T>(options)
    return data as T
}
