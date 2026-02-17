import { message as antMessage } from 'ant-design-vue'

/** Минимальный API для toast: success, error, warning, info. */
export interface MessageInstance {
    success(content: string, duration?: number): void
    error(content: string, duration?: number): void
    warning(content: string, duration?: number): void
    info(content: string, duration?: number): void
}

let messageApi: MessageInstance | null = null

/**
 * Устанавливает API сообщений (например из useMessage() в App). Вызвать один раз после монтирования,
 * чтобы тосты использовали общую тему/контекст. Если не задано — используется статический message ant-design-vue.
 * @param api - Инстанс message или null
 */
export function setMessageApi(api: MessageInstance | null): void {
    messageApi = api
}

/**
 * Возвращает текущий API сообщений. Используется httpClient и общими хелперами для toast.
 */
export function getMessage(): MessageInstance | null {
    return messageApi
}

function api(): MessageInstance {
    return messageApi ?? (antMessage as unknown as MessageInstance)
}

/** Показывает toast успеха. */
export function success(content: string, duration?: number): void {
    api().success(content, duration)
}

/** Показывает toast ошибки. */
export function error(content: string, duration?: number): void {
    api().error(content, duration)
}

/** Показывает toast предупреждения. */
export function warning(content: string, duration?: number): void {
    api().warning(content, duration)
}

/** Показывает информационный toast. */
export function info(content: string, duration?: number): void {
    api().info(content, duration)
}

/** Объект с методами success, error, warning, info. В App вызвать setMessageApi() для тостов в контексте темы. */
export const message = {
    success,
    error,
    warning,
    info
}
