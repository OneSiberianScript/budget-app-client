<script setup lang="ts">
import { computed } from 'vue'

import { formatMoneyFromCents } from '@/shared/lib/format-money'
import { useForecast } from '@/shared/lib/useForecast'
import { TheProgressRing } from '@/shared/ui'

interface Props {
    /** Фактические расходы за месяц (копейки). */
    actualCents: number
    /** Плановые расходы за месяц (копейки). */
    plannedCents: number
    /** Выбранный месяц YYYY-MM. */
    month: string
}

const props = defineProps<Props>()

const actualRef = computed(() => props.actualCents)
const plannedRef = computed(() => props.plannedCents)
const monthRef = computed(() => props.month)

const { overrunCents, progressPercent, daysElapsed, daysTotal } = useForecast({
    actualCents: actualRef,
    plannedCents: plannedRef,
    month: monthRef
})

const ringColor = computed(() => {
    if (progressPercent.value >= 100) return 'var(--color-semantic-error)'
    if (progressPercent.value >= 80) return 'var(--color-semantic-warning)'
    return 'var(--color-semantic-success)'
})

const hasPlan = computed(() => props.plannedCents > 0)
</script>

<template>
    <div class="home-plan-progress-card">
        <span class="home-plan-progress-card__label">Выполнение плана</span>

        <div
            v-if="!hasPlan"
            class="home-plan-progress-card__no-plan"
        >
            <span>План не задан</span>
            <span class="home-plan-progress-card__hint">Добавьте лимиты в разделе «Планы»</span>
        </div>

        <template v-else>
            <div class="home-plan-progress-card__ring-row">
                <TheProgressRing
                    :percent="progressPercent"
                    :color="ringColor"
                    :size="72"
                    :stroke-width="6"
                    show-label
                />
                <div class="home-plan-progress-card__stats">
                    <div class="home-plan-progress-card__stat">
                        <span class="home-plan-progress-card__stat-label">Потрачено</span>
                        <span class="home-plan-progress-card__stat-value">{{ formatMoneyFromCents(actualCents) }}</span>
                    </div>
                    <div class="home-plan-progress-card__stat">
                        <span class="home-plan-progress-card__stat-label">Запланировано</span>
                        <span class="home-plan-progress-card__stat-value">{{
                            formatMoneyFromCents(plannedCents)
                        }}</span>
                    </div>
                </div>
            </div>

            <div
                v-if="overrunCents > 0"
                class="home-plan-progress-card__forecast home-plan-progress-card__forecast_warn"
            >
                При текущем темпе превысишь план на
                <strong>{{ formatMoneyFromCents(overrunCents) }}</strong>
                <span class="home-plan-progress-card__forecast-days">
                    ({{ daysElapsed }} из {{ daysTotal }} дн. прошло)
                </span>
            </div>
            <div
                v-else
                class="home-plan-progress-card__forecast home-plan-progress-card__forecast_ok"
            >
                Ты в норме
                <span class="home-plan-progress-card__forecast-days"> · {{ daysElapsed }} из {{ daysTotal }} дн. </span>
            </div>
        </template>
    </div>
</template>

<style scoped>
.home-plan-progress-card {
    background: var(--color-bg-secondary);
    border-radius: 12px;
    border: 1px solid var(--color-border-default);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.home-plan-progress-card__label {
    font-size: 0.8125rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-muted);
}

.home-plan-progress-card__no-plan {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px 0;
    color: var(--color-text-secondary);
    font-size: 0.9375rem;
}

.home-plan-progress-card__hint {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
}

.home-plan-progress-card__ring-row {
    display: flex;
    align-items: center;
    gap: 16px;
}

.home-plan-progress-card__stats {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.home-plan-progress-card__stat {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.home-plan-progress-card__stat-label {
    font-size: 0.75rem;
    color: var(--color-text-muted);
}

.home-plan-progress-card__stat-value {
    font-size: 0.9375rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: var(--color-text-primary);
}

.home-plan-progress-card__forecast {
    font-size: 0.8125rem;
    border-radius: 8px;
    padding: 8px 12px;
    line-height: 1.4;
}

.home-plan-progress-card__forecast_warn {
    background: var(--color-error-soft);
    color: var(--color-semantic-error);
}

.home-plan-progress-card__forecast_ok {
    background: var(--color-success-soft);
    color: var(--color-semantic-success);
}

.home-plan-progress-card__forecast-days {
    color: inherit;
    opacity: 0.7;
}
</style>
