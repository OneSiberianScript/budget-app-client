import { computed, type ComputedRef, type Ref } from 'vue'

/**
 * Прогноз расходов / доходов на конец месяца по текущему темпу.
 * Экстраполирует факт от прошедших дней на все дни месяца.
 *
 * @param params.actualCents — фактическая сумма в копейках за прошедшие дни
 * @param params.plannedCents — плановая сумма в копейках на весь месяц
 * @param params.month — строка YYYY-MM (текущий или выбранный месяц)
 *
 * @example
 * const { overrunCents, progressPercent } = useForecast({ actualCents, plannedCents, month })
 */
export function useForecast(params: {
    actualCents: Ref<number> | ComputedRef<number>
    plannedCents: Ref<number> | ComputedRef<number>
    month: Ref<string> | ComputedRef<string>
}): {
    projectedCents: ComputedRef<number>
    overrunCents: ComputedRef<number>
    progressPercent: ComputedRef<number>
    daysElapsed: ComputedRef<number>
    daysTotal: ComputedRef<number>
} {
    const daysTotal = computed(() => {
        const [y, m] = params.month.value.split('-').map(Number)
        return new Date(y, m, 0).getDate()
    })

    const daysElapsed = computed(() => {
        const [y, m] = params.month.value.split('-').map(Number)
        const now = new Date()
        const currentY = now.getFullYear()
        const currentM = now.getMonth() + 1

        // Если выбран не текущий месяц — считаем весь месяц как прошедший
        if (currentY !== y || currentM !== m) return daysTotal.value

        return Math.min(now.getDate(), daysTotal.value)
    })

    const projectedCents = computed(() => {
        const elapsed = daysElapsed.value
        if (elapsed === 0) return 0
        const rate = params.actualCents.value / elapsed
        return Math.round(rate * daysTotal.value)
    })

    const overrunCents = computed(() => {
        const diff = projectedCents.value - params.plannedCents.value
        return Math.max(0, diff)
    })

    const progressPercent = computed(() => {
        const planned = params.plannedCents.value
        if (planned === 0) return 0
        return Math.min(100, (params.actualCents.value / planned) * 100)
    })

    return { projectedCents, overrunCents, progressPercent, daysElapsed, daysTotal }
}
