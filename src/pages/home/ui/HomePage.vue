<script setup lang="ts">
import { computed, ref } from 'vue'
import VChart from 'vue-echarts'
import { useRouter } from 'vue-router'

import { QuickTransactionFab } from '@/features/transaction/quick-add'

import { useBudgetStore } from '@/entities/budget'
import { useBudgetMemberStore } from '@/entities/budget-member'
import { useCategoryStore } from '@/entities/category'
import { useMonthlyPlanStore } from '@/entities/monthly-plan'
import { useTransactionStore } from '@/entities/transaction'

import { ROUTE_NAMES } from '@/shared/config/router'
import { useTheme } from '@/shared/config/theme/useTheme'
import { getCurrentMonth, getMonthRange } from '@/shared/lib/date'
import { formatMoneyFromCents } from '@/shared/lib/format-money'
import { usePageData } from '@/shared/lib/usePageData'
import { TheActivityFeed, TheOnboardingCard, ThePageDataBoundary, ThePageHeader } from '@/shared/ui'

import HomePlanProgressCard from './HomePlanProgressCard.vue'
import HomeSummaryCard from './HomeSummaryCard.vue'
import HomeTopCategoriesCard from './HomeTopCategoriesCard.vue'

type TabKey = 'expense' | 'income'

const budgetStore = useBudgetStore()
const budgetMemberStore = useBudgetMemberStore()
const categoryStore = useCategoryStore()
const monthlyPlanStore = useMonthlyPlanStore()
const transactionStore = useTransactionStore()
const router = useRouter()

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
        monthlyPlanStore.fetchMonthlyPlan(budgetId, year, month),
        budgetMemberStore.fetchBudgetMembers(budgetId)
    ])
}

const { loading, error } = usePageData(loadDashboard, {
    watchSources: [() => budgetStore.currentBudgetId, () => selectedMonth.value]
})

const { currentTheme } = useTheme()

// ─── Состояния empty / onboarding ───────────────────────────────────────────
const hasCategories = computed(() => (categoryStore.categories ?? []).length > 0)
const hasTransactions = computed(() => (transactionStore.transactions ?? []).length > 0)
const showOnboarding = computed(() => !hasCategories.value || !hasTransactions.value)

// ─── Итоговые суммы ──────────────────────────────────────────────────────────
const expenseCents = computed(() => {
    const budgetId = budgetStore.currentBudgetId
    if (!budgetId) return 0
    return (transactionStore.transactions ?? [])
        .filter((t) => t.budgetId === budgetId && t.type === 'expense')
        .reduce((sum, t) => sum + Math.round((parseFloat(t.amount) || 0) * 100), 0)
})

const incomeCents = computed(() => {
    const budgetId = budgetStore.currentBudgetId
    if (!budgetId) return 0
    return (transactionStore.transactions ?? [])
        .filter((t) => t.budgetId === budgetId && t.type === 'income')
        .reduce((sum, t) => sum + Math.round((parseFloat(t.amount) || 0) * 100), 0)
})

// ─── Плановые суммы (расходы) ────────────────────────────────────────────────
const plannedExpenseCents = computed(() => {
    const categories = categoryStore.categories ?? []
    const expenseCategoryIds = new Set(categories.filter((c) => c.type === 'expense').map((c) => c.id))
    return (monthlyPlanStore.planItems ?? [])
        .filter((i) => expenseCategoryIds.has(i.categoryId))
        .reduce((sum, i) => sum + Math.round((parseFloat(i.plannedAmount) || 0) * 100), 0)
})

// ─── Pie chart ───────────────────────────────────────────────────────────────
const CATEGORY_COLOR_FALLBACK = '#8c8c8c'
const REMAINDER_COLOR = computed(() => (currentTheme.value === 'dark' ? '#5a5652' : '#e0ddd8'))

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
                        radius: ['60%', '90%'],
                        data: [{ name: emptyLabel, value: 1, itemStyle: { color: REMAINDER_COLOR.value } }],
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

function handleGoCategories() {
    router.push({ name: ROUTE_NAMES.CATEGORY_CREATE })
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
            <!-- Онбординг для новых бюджетов -->
            <TheOnboardingCard
                v-if="showOnboarding"
                :has-categories="hasCategories"
                :has-transactions="hasTransactions"
                @go-categories="handleGoCategories"
                @go-add-transaction="() => {}"
            />

            <!-- Bento grid дашборд -->
            <div
                v-else
                class="home-page__bento"
            >
                <!-- Карточка: итог месяца с picker и count-up -->
                <HomeSummaryCard
                    v-model:selected-month="selectedMonth"
                    :expense-cents="expenseCents"
                    :income-cents="incomeCents"
                    class="home-page__card home-page__card_summary"
                />

                <!-- Карточка: топ-3 категории расходов -->
                <HomeTopCategoriesCard
                    :categories="categoryStore.categories ?? []"
                    :transactions="transactionStore.transactions ?? []"
                    class="home-page__card home-page__card_top"
                />

                <!-- Карточка: прогресс плана + прогноз -->
                <HomePlanProgressCard
                    :actual-cents="expenseCents"
                    :planned-cents="plannedExpenseCents"
                    :month="selectedMonth"
                    class="home-page__card home-page__card_plan"
                />

                <!-- Карточка: pie chart -->
                <div class="home-page__card home-page__card_chart">
                    <div class="home-page__chart-header">
                        <span class="home-page__chart-label">По категориям</span>
                        <div class="home-page__tabs-wrap">
                            <button
                                type="button"
                                class="home-page__tab-btn"
                                :class="{ 'home-page__tab-btn_active': activeTab === 'expense' }"
                                @click="activeTab = 'expense'"
                            >
                                Расходы
                            </button>
                            <button
                                type="button"
                                class="home-page__tab-btn"
                                :class="{ 'home-page__tab-btn_active': activeTab === 'income' }"
                                @click="activeTab = 'income'"
                            >
                                Доходы
                            </button>
                        </div>
                    </div>
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
                </div>

                <!-- Карточка: activity feed -->
                <div class="home-page__card home-page__card_activity">
                    <span class="home-page__activity-label">Активность</span>
                    <TheActivityFeed
                        :transactions="transactionStore.transactions ?? []"
                        :members="budgetMemberStore.members ?? []"
                        :categories="categoryStore.categories ?? []"
                        :max-items="8"
                    />
                </div>
            </div>
        </ThePageDataBoundary>

        <QuickTransactionFab />
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

/* ─── Bento grid ─────────────────────────────────────────────────────────── */
.home-page__bento {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
}

.home-page__card {
    min-width: 0;
}

/* ─── Pie chart card ────────────────────────────────────────────────────── */
.home-page__card_chart {
    background: var(--color-bg-secondary);
    border-radius: 12px;
    border: 1px solid var(--color-border-default);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.home-page__chart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.home-page__chart-label {
    font-size: 0.8125rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-muted);
}

.home-page__tabs-wrap {
    display: flex;
    gap: 4px;
    background: var(--color-bg-tertiary);
    border-radius: 6px;
    padding: 2px;
}

.home-page__tab-btn {
    padding: 4px 12px;
    border: none;
    border-radius: 4px;
    background: transparent;
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    color: var(--color-text-secondary);
    transition:
        background 0.15s,
        color 0.15s;
}

.home-page__tab-btn_active {
    background: var(--color-bg-primary);
    color: var(--color-text-primary);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.home-page__chart-wrapper {
    position: relative;
    height: 240px;
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
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--color-text);
    font-variant-numeric: tabular-nums;
}

.home-page__chart-center-line_spent {
    color: var(--color-error);
}

/* ─── Activity card ─────────────────────────────────────────────────────── */
.home-page__card_activity {
    background: var(--color-bg-secondary);
    border-radius: 12px;
    border: 1px solid var(--color-border-default);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.home-page__activity-label {
    font-size: 0.8125rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-muted);
}

/* ─── Tablet: 2 колонки ─────────────────────────────────────────────────── */
@media (min-width: 768px) {
    .home-page__bento {
        grid-template-columns: 1fr 1fr;
        grid-template-areas:
            'summary  top'
            'plan     activity'
            'chart    chart';
    }

    .home-page__card_summary {
        grid-area: summary;
    }
    .home-page__card_top {
        grid-area: top;
    }
    .home-page__card_plan {
        grid-area: plan;
    }
    .home-page__card_activity {
        grid-area: activity;
    }
    .home-page__card_chart {
        grid-area: chart;
    }

    .home-page__chart-wrapper {
        height: 280px;
    }
}

/* ─── Desktop: 3 колонки ────────────────────────────────────────────────── */
@media (min-width: 1024px) {
    .home-page__bento {
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-areas:
            'summary  top     plan'
            'chart    chart   activity';
    }

    .home-page__chart-wrapper {
        height: 300px;
    }
}
</style>
