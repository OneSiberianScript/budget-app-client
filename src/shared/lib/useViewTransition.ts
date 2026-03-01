import { readonly, ref } from 'vue'

/**
 * Обёртка над браузерным View Transitions API.
 * Graceful degradation: если API не поддерживается, fn вызывается напрямую.
 *
 * @example
 * const { navigate } = useViewTransition()
 * navigate(() => router.push('/transactions'))
 */
export function useViewTransition() {
    const isSupported = readonly(ref(typeof document !== 'undefined' && 'startViewTransition' in document))

    /**
     * Оборачивает навигационный колбэк в startViewTransition.
     * @param fn — функция, изменяющая состояние (router.push, ref-присваивание и т.д.)
     */
    async function navigate(fn: () => void | Promise<void>): Promise<void> {
        if (!isSupported.value) {
            await fn()
            return
        }
        await (
            document as Document & {
                startViewTransition: (cb: () => void | Promise<void>) => { finished: Promise<void> }
            }
        ).startViewTransition(fn).finished
    }

    return { navigate, isSupported }
}
