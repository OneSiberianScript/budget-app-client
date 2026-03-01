<script setup lang="ts">
import { computed } from 'vue'

import { formatMoneyFromCents } from '@/shared/lib/format-money'
import { useCountUp } from '@/shared/lib/useCountUp'
import { TheDatePicker } from '@/shared/ui'

interface Props {
    /** Расходы за выбранный месяц (копейки). */
    expenseCents: number
    /** Доходы за выбранный месяц (копейки). */
    incomeCents: number
    /** Выбранный месяц YYYY-MM (v-model). */
    selectedMonth: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:selectedMonth': [value: string] }>()

const expenseRef = computed(() => props.expenseCents)
const incomeRef = computed(() => props.incomeCents)

const { displayValue: expenseDisplay } = useCountUp(expenseRef, { formatter: formatMoneyFromCents })
const { displayValue: incomeDisplay } = useCountUp(incomeRef, { formatter: formatMoneyFromCents })

const balance = computed(() => props.incomeCents - props.expenseCents)
const balanceRef = computed(() => Math.abs(balance.value))
const isPositive = computed(() => balance.value >= 0)

const { displayValue: balanceDisplay } = useCountUp(balanceRef, { formatter: formatMoneyFromCents })
</script>

<template>
    <div class="home-summary-card">
        <div class="home-summary-card__header">
            <span class="home-summary-card__label">Итог месяца</span>
            <TheDatePicker
                :model-value="selectedMonth"
                label="Период"
                placeholder="Месяц"
                picker="month"
                @update:model-value="emit('update:selectedMonth', $event as string)"
            />
        </div>

        <div class="home-summary-card__balance">
            <span
                class="home-summary-card__balance-value"
                :class="
                    isPositive
                        ? 'home-summary-card__balance-value_positive'
                        : 'home-summary-card__balance-value_negative'
                "
                aria-live="polite"
            >
                {{ isPositive ? '+' : '−' }}{{ balanceDisplay }}
            </span>
            <span class="home-summary-card__balance-label">
                {{ isPositive ? 'профицит' : 'дефицит' }}
            </span>
        </div>

        <div class="home-summary-card__row">
            <div class="home-summary-card__stat">
                <span class="home-summary-card__stat-label">Доходы</span>
                <span class="home-summary-card__stat-value home-summary-card__stat-value_income">
                    +{{ incomeDisplay }}
                </span>
            </div>
            <div class="home-summary-card__stat">
                <span class="home-summary-card__stat-label">Расходы</span>
                <span class="home-summary-card__stat-value home-summary-card__stat-value_expense">
                    −{{ expenseDisplay }}
                </span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.home-summary-card {
    background: var(--color-bg-secondary);
    border-radius: 12px;
    border: 1px solid var(--color-border-default);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.home-summary-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.home-summary-card__label {
    font-size: 0.8125rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-muted);
}

.home-summary-card__header :deep(.the-date-picker-standalone) {
    max-width: 140px;
}

.home-summary-card__balance {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.home-summary-card__balance-value {
    font-size: var(--font-size-display, 2.5rem);
    font-weight: var(--font-weight-display, 700);
    line-height: 1;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
}

.home-summary-card__balance-value_positive {
    color: var(--color-semantic-success);
}

.home-summary-card__balance-value_negative {
    color: var(--color-semantic-error);
}

.home-summary-card__balance-label {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
}

.home-summary-card__row {
    display: flex;
    gap: 16px;
}

.home-summary-card__stat {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 10px 12px;
    background: var(--color-bg-tertiary);
    border-radius: 8px;
}

.home-summary-card__stat-label {
    font-size: 0.75rem;
    color: var(--color-text-muted);
}

.home-summary-card__stat-value {
    font-size: 1rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
}

.home-summary-card__stat-value_income {
    color: var(--color-semantic-success);
}

.home-summary-card__stat-value_expense {
    color: var(--color-semantic-error);
}
</style>
