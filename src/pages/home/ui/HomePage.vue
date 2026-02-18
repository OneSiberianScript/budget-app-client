<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import VChart from 'vue-echarts'
import { useRouter } from 'vue-router'

import { useBudgetStore } from '@/entities/budget'
import { useCategoryStore } from '@/entities/category'
import { useMonthlyPlanStore } from '@/entities/monthly-plan'
import { useTransactionStore } from '@/entities/transaction'

import { ROUTE_NAMES } from '@/shared/config/router'
import { formatMoneyFromCents } from '@/shared/lib/format-money'
import { TheAlert, TheButton, TheEmpty, ThePageHeader, TheSpin } from '@/shared/ui'

const router = useRouter()
const budgetStore = useBudgetStore()
const categoryStore = useCategoryStore()
const monthlyPlanStore = useMonthlyPlanStore()
const transactionStore = useTransactionStore()

const loading = ref(true)
const error = ref<string | null>(null)

/** Текущий месяц в формате YYYY-MM */
function getCurrentMonth(): string {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

/** Границы месяца from/to для API */
function getMonthRange(month: string): { from: string; to: string } {
    const [y, m] = month.split('-').map(Number)
    const from = new Date(y, m - 1, 1)
    const to = new Date(y, m, 0)
    return {
        from: from.toISOString().slice(0, 10),
        to: to.toISOString().slice(0, 10)
    }
}

const currentMonth = computed(() => getCurrentMonth())
const monthRange = computed(() => getMonthRange(currentMonth.value))

const hasBudget = computed(() => !!budgetStore.currentBudgetId)

/** Сумма потраченного за месяц (только расходы, в копейках). amount в API — строка (рубли). */
const spentCents = computed(() => {
    const budgetId = budgetStore.currentBudgetId
    if (!budgetId) return 0
    const categories = categoryStore.categories ?? []
    const expenseCategoryIds = new Set(categories.filter((c) => c.type === 'expense').map((c) => c.id))
    const transactions = transactionStore.transactions ?? []
    return transactions
        .filter((t) => t.budgetId === budgetId && expenseCategoryIds.has(t.categoryId))
        .reduce((sum, t) => sum + Math.round((parseFloat(t.amount) || 0) * 100), 0)
})

/** Сумма запланированного на месяц (лимиты по категориям, в копейках). plannedAmount в API — строка (рубли). */
const plannedCents = computed(() => {
    const items = monthlyPlanStore.planItems ?? []
    return items.reduce((sum, i) => sum + Math.round((parseFloat(i.plannedAmount) || 0) * 100), 0)
})

/** Данные для бублика: траты по категориям (только расходы) */
const pieOption = computed(() => {
    const budgetId = budgetStore.currentBudgetId
    if (!budgetId) return null
    const categoriesList = categoryStore.categories ?? []
    const expenseCategories = categoriesList.filter((c) => c.type === 'expense')
    const byId = Object.fromEntries(expenseCategories.map((c) => [c.id, c.name]))
    const sums: Record<string, number> = {}
    const txList = transactionStore.transactions ?? []
    for (const t of txList) {
        if (t.budgetId !== budgetId || !byId[t.categoryId]) continue
        const amountCents = Math.round((parseFloat(t.amount) || 0) * 100)
        sums[t.categoryId] = (sums[t.categoryId] ?? 0) + amountCents
    }
    const data = Object.entries(sums)
        .map(([categoryId, value]) => ({ name: byId[categoryId] ?? categoryId, value }))
        .filter((d) => d.value > 0)
        .sort((a, b) => b.value - a.value)
    if (data.length === 0) {
        return {
            tooltip: { trigger: 'item' },
            series: [
                { type: 'pie', radius: ['40%', '70%'], data: [{ name: 'Нет трат', value: 0 }], label: { show: false } }
            ]
        }
    }
    return {
        tooltip: {
            trigger: 'item',
            formatter: (params: { name: string; value: number; percent: number }) =>
                `${params.name}: ${formatMoneyFromCents(params.value)} (${params.percent.toFixed(0)}%)`
        },
        series: [
            {
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '50%'],
                data,
                label: { show: true }
            }
        ]
    }
})

async function loadDashboard() {
    const budgetId = budgetStore.currentBudgetId
    if (!budgetId) {
        loading.value = false
        return
    }
    error.value = null
    loading.value = true
    try {
        const { from, to } = monthRange.value
        const [year, month] = currentMonth.value.split('-').map(Number)
        await Promise.all([
            categoryStore.fetchCategories(budgetId),
            transactionStore.fetchTransactions(budgetId, { from, to }),
            monthlyPlanStore.fetchMonthlyPlan(budgetId, year, month)
        ])
    } catch (e) {
        error.value = e instanceof Error ? e.message : 'Ошибка загрузки'
    } finally {
        loading.value = false
    }
}

onMounted(() => loadDashboard())
watch(
    () => budgetStore.currentBudgetId,
    () => loadDashboard()
)
watch(currentMonth, () => loadDashboard())

function goToAddTransaction(type: 'expense' | 'income') {
    router.push({ name: ROUTE_NAMES.TRANSACTIONS, query: { open: 'create', type } })
}
</script>

<template>
    <div class="home-page">
        <ThePageHeader title="Главная" />
        <TheSpin :spinning="loading">
            <template v-if="!hasBudget">
                <TheEmpty description="Выберите бюджет" />
            </template>
            <template v-else-if="error">
                <TheAlert
                    type="error"
                    :message="error"
                />
            </template>
            <template v-else>
                <section
                    class="home-page__summary"
                    aria-label="Итоги месяца"
                >
                    <div class="home-page__summary-center">
                        <div class="home-page__summary-item">
                            <span class="home-page__summary-label">Потрачено</span>
                            <span class="home-page__summary-value home-page__summary-value_spent">{{
                                formatMoneyFromCents(spentCents)
                            }}</span>
                        </div>
                        <div class="home-page__summary-item">
                            <span class="home-page__summary-label">Запланировано</span>
                            <span class="home-page__summary-value">{{ formatMoneyFromCents(plannedCents) }}</span>
                        </div>
                    </div>
                </section>

                <section
                    class="home-page__chart"
                    aria-label="Траты по категориям"
                >
                    <div
                        v-if="pieOption"
                        class="home-page__chart-inner"
                    >
                        <VChart
                            :option="pieOption"
                            autoresize
                        />
                    </div>
                </section>

                <section class="home-page__actions">
                    <TheButton
                        type="primary"
                        @click="goToAddTransaction('expense')"
                    >
                        Внести расход
                    </TheButton>
                    <TheButton
                        type="primary"
                        @click="goToAddTransaction('income')"
                    >
                        Внести доход
                    </TheButton>
                </section>
            </template>
        </TheSpin>
    </div>
</template>

<style scoped>
.home-page {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-height: 0;
}

.home-page__summary {
    flex-shrink: 0;
}

.home-page__summary-center {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    justify-content: center;
}

.home-page__summary-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
}

.home-page__summary-label {
    font-size: 0.875rem;
    color: var(--color-text-secondary, #666);
}

.home-page__summary-value {
    font-size: 1.25rem;
    font-weight: 600;
}

.home-page__summary-value_spent {
    color: var(--color-error, #ff4d4f);
}

.home-page__chart {
    flex: 1;
    min-height: 200px;
}

.home-page__chart-inner {
    height: 280px;
    width: 100%;
}

.home-page__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
    flex-shrink: 0;
}

@media (min-width: 768px) {
    .home-page__summary-center {
        gap: 48px;
    }
    .home-page__chart-inner {
        height: 320px;
    }
}
</style>
