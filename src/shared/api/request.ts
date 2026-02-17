import { httpClient } from './httpClient'

import type { AxiosRequestConfig } from 'axios'

export type RequestOptions = AxiosRequestConfig & {
    /** Не показывать глобальный toast при ошибке (например для refresh, logout) */
    _suppressErrorNotification?: boolean
}

/**
 * Типизированная обёртка над httpClient (Bearer, обновление при 401, toast при ошибке).
 * @param options - Параметры запроса (url, method, data и т.д.)
 * @returns Данные ответа (data)
 */
export async function request<T = unknown>(options: RequestOptions): Promise<T> {
    const { data } = await httpClient.request<T>(options)
    return data as T
}
