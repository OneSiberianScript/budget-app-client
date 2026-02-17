import { ref, type Ref } from 'vue'

type ApiFn<T> = () => Promise<T>

export interface UseApiOptions {
    /** Run fn immediately on mount */
    immediate?: boolean
}

export interface UseApiReturn<T> {
    data: Ref<T | null>
    error: Ref<Error | null>
    isLoading: Ref<boolean>
    execute: () => Promise<void>
}

/**
 * Wraps an async API call in refs (data, error, isLoading) and optional immediate execution.
 * @param fn - Function returning a Promise (e.g. () => httpClient.get('/path'))
 * @param options.immediate - Run fn on first tick
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
