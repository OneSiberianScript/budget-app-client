<script setup lang="ts">
import { Tabs } from 'ant-design-vue'
import { computed, ref } from 'vue'
import VChart from 'vue-echarts'
import { useRouter } from 'vue-router'

import { useBudgetStore } from '@/entities/budget'
import { useCategoryStore } from '@/entities/category'
import { useMonthlyPlanStore } from '@/entities/monthly-plan'
import { useTransactionStore } from '@/entities/transaction'

import { ROUTE_NAMES } from '@/shared/config/router'
import { useTheme } from '@/shared/config/theme/useTheme'
import { getCurrentMonth, getMonthRange } from '@/shared/lib/date'
import { formatMoneyFromCents } from '@/shared/lib/format-money'
import { usePageData } from '@/shared/lib/usePageData'
import { TheButton, TheDatePicker, ThePageDataBoundary, ThePageHeader, TheTabs } from '@/shared/ui'

type TabKey = 'expense' | 'income'

const router = useRouter()
const budgetStore = useBudgetStore()
const categoryStore = useCategoryStore()
const monthlyPlanStore = useMonthlyPlanStore()
const transactionStore = useTransactionStore()

const selectedMonth = ref(getCurrentMonth())
const activeTab = ref<TabKey>('expense')

const monthRange = computed(() => getMonthRange(selectedMonth.value))

const hasBudget = computed(() => !!budgetStore.currentBudgetId)

async function loadDashboard() {
    const budgetId = budgetStore.currentBudgetId
    if (!budgetId) return
    const { from, to } = monthRange.value
    const [year, month] = selectedMonth.value.split('-').map(Number)
    await Promise.all([
        categoryStore.fetchCategories(budgetId),
        transactionStore.fetchTransactions(budgetId, { from, to }),
        monthlyPlanStore.fetchMonthlyPlan(budgetId, year, month)
    ])
}

const { loading, error } = usePageData(loadDashboard, {
    watchSources: [() => budgetStore.currentBudgetId, () => selectedMonth.value]
})

const { currentTheme } = useTheme()

const TabPane = Tabs.TabPane

const CATEGORY_COLOR_FALLBACK = '#8c8c8c'
/** Цвет «Остаток» в круговой диаграмме: светлый приглушённый на light, тёмный приглушённый на dark. */
const REMAINDER_COLOR = computed(() => (currentTheme.value === 'dark' ? '#5a5652' : '#e0ddd8'))

/** Сумма по категориям за месяц (копейки) и план по ним в зависимости от типа таба. */
function useChartData(type: TabKey) {
    const categoryType = type === 'expense' ? 'expense' : 'income'
    const spentCents = computed(() => {
        const budgetId = budgetStore.currentBudgetId
        if (!budgetId) return 0
        const categories = categoryStore.categories ?? []
        const categoryIds = new Set(categories.filter((c) => c.type === categoryType).map((c) => c.id))
        const transactions = transactionStore.transactions ?? []
        return transactions
            .filter(
                (t) =>
                    t.budgetId === budgetId &&
                    t.categoryId != null &&
                    categoryIds.has(t.categoryId) &&
                    t.type === categoryType
            )
            .reduce((sum, t) => sum + Math.round((parseFloat(t.amount) || 0) * 100), 0)
    })

    const plannedCents = computed(() => {
        const categories = categoryStore.categories ?? []
        const categoryIds = new Set(categories.filter((c) => c.type === categoryType).map((c) => c.id))
        const items = monthlyPlanStore.planItems ?? []
        return items
            .filter((i) => categoryIds.has(i.categoryId))
            .reduce((sum, i) => sum + Math.round((parseFloat(i.plannedAmount) || 0) * 100), 0)
    })

    const emptyLabel = type === 'expense' ? 'Нет трат' : 'Нет доходов'

    const pieOption = computed(() => {
        const budgetId = budgetStore.currentBudgetId
        if (!budgetId) return null
        const categoriesList = categoryStore.categories ?? []
        const categories = categoriesList.filter((c) => c.type === categoryType)
        const byId = Object.fromEntries(categories.map((c) => [c.id, c.name]))
        const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]))
        const sums: Record<string, number> = {}
        const txList = transactionStore.transactions ?? []
        for (const t of txList) {
            if (t.budgetId !== budgetId || t.categoryId == null || !byId[t.categoryId] || t.type !== categoryType)
                continue
            const amountCents = Math.round((parseFloat(t.amount) || 0) * 100)
            sums[t.categoryId] = (sums[t.categoryId] ?? 0) + amountCents
        }
        let data = Object.entries(sums)
            .map(([categoryId, value]) => ({
                name: byId[categoryId] ?? categoryId,
                value,
                itemStyle: { color: categoryById[categoryId]?.color ?? CATEGORY_COLOR_FALLBACK }
            }))
            .filter((d) => d.value > 0)
            .sort((a, b) => b.value - a.value)
        if (type === 'expense') {
            const remainderCents = plannedCents.value - spentCents.value
            if (remainderCents > 0) {
                data = [
                    ...data,
                    { name: 'Остаток', value: remainderCents, itemStyle: { color: REMAINDER_COLOR.value } }
                ]
            }
        }
        if (data.length === 0) {
            return {
                tooltip: { trigger: 'item' },
                series: [
                    {
                        type: 'pie',
                        radius: ['40%', '70%'],
                        data: [{ name: emptyLabel, value: 0 }],
                        label: { show: false }
                    }
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
                    radius: ['60%', '90%'],
                    center: ['50%', '50%'],
                    data,
                    avoidLabelOverlap: false,
                    padAngle: 1,
                    itemStyle: { borderRadius: 2 },
                    label: { show: false, position: 'center' }
                }
            ]
        }
    })

    return { spentCents, plannedCents, pieOption }
}

const expenseData = useChartData('expense')
const incomeData = useChartData('income')

const chartData = computed(() => {
    const d = activeTab.value === 'expense' ? expenseData : incomeData
    return {
        spentCents: d.spentCents.value,
        plannedCents: d.plannedCents.value,
        pieOption: d.pieOption.value
    }
})

function goToAddTransaction(type: 'expense' | 'income') {
    router.push({ name: ROUTE_NAMES.TRANSACTIONS, query: { open: 'create', type } })
}
</script>

<template>
    <div class="home-page">
        <ThePageHeader title="Главная" />
        <ThePageDataBoundary
            :loading="loading"
            :has-budget="hasBudget"
            :error="error"
        >
            <section
                class="home-page__period"
                aria-label="Период"
            >
                <TheDatePicker
                    v-model="selectedMonth"
                    label="Период"
                    placeholder="Выберите месяц"
                    picker="month"
                />
            </section>

            <TheTabs
                v-model:active-key="activeTab"
                class="home-page__tabs"
            >
                <TabPane
                    key="expense"
                    tab="Расходы"
                >
                    <section
                        class="home-page__chart"
                        aria-label="Расходы по категориям"
                    >
                        <div
                            v-if="chartData.pieOption"
                            class="home-page__chart-wrapper"
                        >
                            <div class="home-page__chart-inner">
                                <VChart
                                    :key="activeTab"
                                    :option="chartData.pieOption"
                                    autoresize
                                />
                            </div>
                            <div
                                class="home-page__chart-center"
                                aria-hidden="true"
                            >
                                <span class="home-page__chart-center-line">{{
                                    formatMoneyFromCents(chartData.plannedCents)
                                }}</span>
                                <span class="home-page__chart-center-line home-page__chart-center-line_spent">{{
                                    formatMoneyFromCents(chartData.spentCents)
                                }}</span>
                            </div>
                        </div>
                    </section>
                </TabPane>
                <TabPane
                    key="income"
                    tab="Доходы"
                >
                    <section
                        class="home-page__chart"
                        aria-label="Доходы по категориям"
                    >
                        <div
                            v-if="chartData.pieOption"
                            class="home-page__chart-wrapper"
                        >
                            <div class="home-page__chart-inner">
                                <VChart
                                    :key="activeTab"
                                    :option="chartData.pieOption"
                                    autoresize
                                />
                            </div>
                            <div
                                class="home-page__chart-center"
                                aria-hidden="true"
                            >
                                <span class="home-page__chart-center-line">{{
                                    formatMoneyFromCents(chartData.plannedCents)
                                }}</span>
                                <span class="home-page__chart-center-line home-page__chart-center-line_spent">{{
                                    formatMoneyFromCents(chartData.spentCents)
                                }}</span>
                            </div>
                        </div>
                    </section>
                </TabPane>
            </TheTabs>

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
        </ThePageDataBoundary>
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
    color: var(--color-text-secondary);
}

.home-page__summary-value {
    font-size: 1.25rem;
    font-weight: 600;
}

.home-page__summary-value_spent {
    color: var(--color-error);
}

.home-page__chart {
    flex: 1;
    min-height: 200px;
}

.home-page__chart-wrapper {
    position: relative;
    height: 280px;
    width: 100%;
}

.home-page__chart-inner {
    height: 100%;
    width: 100%;
}

.home-page__chart-center {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    pointer-events: none;
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text);
}

.home-page__chart-center-line_spent {
    color: var(--color-error);
}

.home-page__period {
    flex-shrink: 0;
}

.home-page__period :deep(.the-date-picker-standalone) {
    max-width: 160px;
}

.home-page__tabs {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
}

.home-page__tabs :deep(.ant-tabs-content) {
    flex: 1;
    min-height: 0;
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
    .home-page__chart-wrapper {
        height: 320px;
    }
    .home-page__chart-center {
        font-size: 1.125rem;
    }
}
</style>
