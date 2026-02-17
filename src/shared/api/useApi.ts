import { ref, type Ref } from 'vue'

type ApiFn<T> = () => Promise<T>

export interface UseApiOptions {
    /** Запустить fn сразу при монтировании */
    immediate?: boolean
}

export interface UseApiReturn<T> {
    /** Результат последнего успешного вызова */
    data: Ref<T | null>
    /** Ошибка последнего вызова */
    error: Ref<Error | null>
    /** Идёт ли выполнение */
    isLoading: Ref<boolean>
    /** Запустить запрос вручную */
    execute: () => Promise<void>
}

/**
 * Оборачивает асинхронный API-вызов в refs (data, error, isLoading) с опциональным немедленным запуском.
 * @param fn - Функция, возвращающая Promise (например, () => httpClient.get('/path'))
 * @param options.immediate - Запустить fn при первом тике
 * @returns { data, error, isLoading, execute }
 */
export function useApi<T>(fn: ApiFn<T>, options: UseApiOptions = {}): UseApiReturn<T> {
    const data = ref<T | null>(null) as Ref<T | null>
    const error = ref<Error | null>(null)
    const isLoading = ref(false)

    async function execute() {
        isLoading.value = true
        error.value = null
        try {
            data.value = await fn()
        } catch (e) {
            error.value = e instanceof Error ? e : new Error(String(e))
        } finally {
            isLoading.value = false
        }
    }

    if (options.immediate) {
        execute()
    }

    return { data, error, isLoading, execute }
}
