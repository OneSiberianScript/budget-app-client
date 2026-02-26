import { onMounted, ref, watch } from 'vue'

/**
 * Композабл загрузки данных страницы: запускает loader при монтировании и при изменении watchSources.
 * Не показывает пустое состояние до завершения загрузки — вызывающая сторона должна показывать лоадер при loading === true.
 *
 * @param loader - Асинхронная функция загрузки (например, запросы в store)
 * @param options.watchSources - Массив геттеров; при изменении любого значения loader вызывается снова
 * @returns loading — идёт загрузка, error — сообщение об ошибке, reload — вызвать loader вручную
 */
export function usePageData(loader: () => Promise<void>, options?: { watchSources?: Array<() => unknown> }) {
    const loading = ref(true)
    const error = ref<string | null>(null)

    async function run() {
        loading.value = true
        error.value = null
        try {
            await loader()
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Ошибка загрузки'
        } finally {
            loading.value = false
        }
    }

    onMounted(run)

    const sources = options?.watchSources
    if (sources?.length) {
        watch(
            () => sources.map((s) => s()),
            () => run(),
            { deep: true }
        )
    }

    return { loading, error, reload: run }
}
