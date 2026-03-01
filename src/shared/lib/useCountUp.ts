import { useTransition, TransitionPresets } from '@vueuse/core'
import { computed, type ComputedRef, type Ref } from 'vue'

/**
 * Анимирует числовое значение при изменении (count-up эффект).
 * Использует @vueuse/core useTransition с easing easeOutExpo.
 *
 * @param target — реактивное число для анимации
 * @param options.duration — длительность анимации в мс (по умолчанию 600)
 * @param options.formatter — функция форматирования итогового значения
 *
 * @example
 * const totalCents = computed(() => 12500)
 * const { displayValue } = useCountUp(totalCents, { formatter: formatMoneyFromCents })
 */
export function useCountUp(
    target: Ref<number> | ComputedRef<number>,
    options?: {
        duration?: number
        formatter?: (value: number) => string
    }
): { displayValue: Readonly<Ref<string>> } {
    const duration = options?.duration ?? 600
    const formatter = options?.formatter ?? ((v: number) => String(Math.round(v)))

    const animated = useTransition(target, {
        duration,
        transition: TransitionPresets.easeOutExpo
    })

    // Если target меняется до завершения анимации — useTransition перезапускает автоматически.
    // При SSR или нулевом значении сразу возвращаем отформатированный результат.
    const displayValue = computed(() => formatter(animated.value))

    return { displayValue: displayValue as Readonly<Ref<string>> }
}
