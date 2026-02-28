<script setup lang="ts">
import { Tabs } from 'ant-design-vue'
import { ref, computed, watch } from 'vue'

import type { PlanItemFormValues } from '@/features/monthly-plan/plan-item-form/model/PlanItemForm.types'
import PlanItemForm from '@/features/monthly-plan/plan-item-form/ui/PlanItemForm.vue'

import { useBudgetStore } from '@/entities/budget'
import { useCategoryStore } from '@/entities/category'
import { useMonthlyPlanStore } from '@/entities/monthly-plan'
import type { MonthlyPlanItem } from '@/entities/monthly-plan'
import {
    createMonthlyPlan,
    createMonthlyPlanItem,
    updateMonthlyPlanItem,
    fetchMonthlyPlanItems
} from '@/entities/monthly-plan/api'
import { useTransactionStore } from '@/entities/transaction'

import { getCurrentMonth, getMonthRange } from '@/shared/lib/date'
import { message } from '@/shared/lib/message'
import { usePageData } from '@/shared/lib/usePageData'
import type { CategoryPlanLineItem } from '@/shared/ui'
import {
    TheCategoryPlanLines,
    TheDatePicker,
    TheDrawer,
    TheEmpty,
    ThePageDataBoundary,
    ThePageHeader,
    TheTabs
} from '@/shared/ui'

type TabKey = 'expense' | 'income'

const budgetStore = useBudgetStore()
const categoryStore = useCategoryStore()
const monthlyPlanStore = useMonthlyPlanStore()
const transactionStore = useTransactionStore()

const drawerOpen = ref(false)
const editingItem = ref<MonthlyPlanItem | null>(null)
const submitLoading = ref(false)
const selectedMonth = ref(getCurrentMonth())
const activeTab = ref<TabKey>('expense')

const monthRange = computed(() => getMonthRange(selectedMonth.value))

const hasBudget = computed(() => !!budgetStore.currentBudgetId)

/** Категории типа «расход» для выбора лимита */
const expenseCategoryOptions = computed(() => {
    const list = categoryStore.categories ?? []
    return list.filter((c) => c.type === 'expense').map((c) => ({ label: c.name, value: c.id }))
})

/** Категории типа «доход» для выбора лимита. */
const incomeCategoryOptions = computed(() => {
    const list = categoryStore.categories ?? []
    return list.filter((c) => c.type === 'income').map((c) => ({ label: c.name, value: c.id }))
})

/** Варианты категорий для формы в зависимости от активного таба */
const currentCategoryOptions = computed(() =>
    activeTab.value === 'expense' ? expenseCategoryOptions.value : incomeCategoryOptions.value
)

/** Факт по категориям за выбранный месяц (копейки), по типу транзакции */
const actualByCategoryCents = computed(() => {
    const budgetId = budgetStore.currentBudgetId
    if (!budgetId) return {} as Record<string, number>
    const categories = categoryStore.categories ?? []
    const categoryIds = new Set(categories.filter((c) => c.type === activeTab.value).map((c) => c.id))
    const transactions = transactionStore.transactions ?? []
    const out: Record<string, number> = {}
    for (const t of transactions) {
        if (
            t.budgetId !== budgetId ||
            t.categoryId == null ||
            !categoryIds.has(t.categoryId) ||
            t.type !== activeTab.value
        )
            continue
        const cents = Math.round((parseFloat(t.amount) || 0) * 100)
        out[t.categoryId] = (out[t.categoryId] ?? 0) + cents
    }
    return out
})

/** Категории активного таба (расходы или доходы) */
const categoriesByTab = computed(() => {
    const list = categoryStore.categories ?? []
    return list.filter((c) => c.type === activeTab.value)
})

/** Элементы плана по categoryId для быстрого поиска */
const planByCategoryId = computed(() => {
    const items = monthlyPlanStore.planItems ?? []
    const map = new Map<string, MonthlyPlanItem>()
    for (const item of items) {
        map.set(item.categoryId, item)
    }
    return map
})

/** Данные для TheCategoryPlanLines: все категории таба с планом и фактом (план 0 если лимит не задан). Сначала с заданным лимитом, затем без. */
const planLinesItems = computed((): CategoryPlanLineItem[] => {
    const items = categoriesByTab.value.map((category) => {
        const planItem = planByCategoryId.value.get(category.id)
        const plannedCents = planItem ? Math.round((parseFloat(planItem.plannedAmount) || 0) * 100) : 0
        const actualCents = actualByCategoryCents.value[category.id] ?? 0
        return {
            id: category.id,
            categoryId: category.id,
            categoryName: category.name,
            color: category.color ?? undefined,
            plannedCents,
            actualCents,
            planItemId: planItem?.id
        }
    })
    return items.sort((a, b) => {
        const aHasPlan = a.planItemId != null ? 1 : 0
        const bHasPlan = b.planItemId != null ? 1 : 0
        if (aHasPlan !== bHasPlan) return bHasPlan - aHasPlan
        return a.categoryName.localeCompare(b.categoryName)
    })
})

const TabPane = Tabs.TabPane

function getPlanItemById(id: string): MonthlyPlanItem | undefined {
    return monthlyPlanStore.planItems?.find((i) => i.id === id)
}

const preselectedCategoryId = ref<string | null>(null)

function openCreateWithCategory(categoryId: string) {
    editingItem.value = null
    preselectedCategoryId.value = categoryId
    drawerOpen.value = true
}

function openEdit(record: MonthlyPlanItem) {
    editingItem.value = record
    preselectedCategoryId.value = null
    drawerOpen.value = true
}

function handleLineClick(line: { planItemId?: string; categoryId: string }) {
    if (line.planItemId) {
        const record = getPlanItemById(line.planItemId)
        if (record) openEdit(record)
    } else {
        openCreateWithCategory(line.categoryId)
    }
}

async function ensurePlan() {
    const budgetId = budgetStore.currentBudgetId
    if (!budgetId) return null
    const [year, month] = selectedMonth.value.split('-').map(Number)
    let plan = monthlyPlanStore.currentPlan
    if (!plan || plan.year !== year || plan.month !== month) {
        plan = await createMonthlyPlan({ budgetId, year, month })
        monthlyPlanStore.setCurrentPlan(plan)
        const items = await fetchMonthlyPlanItems(plan.id)
        monthlyPlanStore.setPlanItems(items)
    }
    return plan
}

async function handleFormSubmit(values: PlanItemFormValues) {
    const budgetId = budgetStore.currentBudgetId
    if (!budgetId) return
    const plan = await ensurePlan()
    if (!plan) return
    submitLoading.value = true
    try {
        const plannedAmount = String(values.limitRub)
        if (editingItem.value) {
            await updateMonthlyPlanItem(editingItem.value.id, { plannedAmount })
            monthlyPlanStore.setPlanItem({ ...editingItem.value, plannedAmount } as MonthlyPlanItem)
            message.success('Лимит обновлён')
        } else {
            const created = await createMonthlyPlanItem({
                monthlyPlanId: plan.id,
                categoryId: values.categoryId,
                plannedAmount
            })
            monthlyPlanStore.setPlanItem(created as MonthlyPlanItem)
            message.success('Лимит добавлен')
        }
        drawerOpen.value = false
    } finally {
        submitLoading.value = false
    }
}

async function load() {
    const budgetId = budgetStore.currentBudgetId
    if (!budgetId) return
    const [year, month] = selectedMonth.value.split('-').map(Number)
    const { from, to } = monthRange.value
    await Promise.all([
        categoryStore.fetchCategories(budgetId),
        monthlyPlanStore.fetchMonthlyPlan(budgetId, year, month),
        transactionStore.fetchTransactions(budgetId, { from, to })
    ])
}

const { loading, error } = usePageData(load, {
    watchSources: [() => budgetStore.currentBudgetId, () => selectedMonth.value]
})

watch(drawerOpen, (open) => {
    if (!open) preselectedCategoryId.value = null
})
</script>

<template>
    <div class="budget-plans-page">
        <ThePageHeader title="Планы по бюджету" />

        <ThePageDataBoundary
            :loading="loading"
            :has-budget="hasBudget"
            :error="error"
        >
            <section
                class="budget-plans-page__period"
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
                class="budget-plans-page__tabs"
            >
                <TabPane
                    key="expense"
                    tab="Расходы"
                >
                    <div class="budget-plans-page__tab-content">
                        <TheCategoryPlanLines
                            v-if="categoriesByTab.length > 0"
                            :items="planLinesItems"
                            type="expense"
                            @click-line="handleLineClick"
                        />
                        <TheEmpty
                            v-else
                            description="Нет категорий расходов. Добавьте категории в настройках бюджета."
                        />
                    </div>
                </TabPane>
                <TabPane
                    key="income"
                    tab="Доходы"
                >
                    <div class="budget-plans-page__tab-content">
                        <TheCategoryPlanLines
                            v-if="categoriesByTab.length > 0"
                            :items="planLinesItems"
                            type="income"
                            @click-line="handleLineClick"
                        />
                        <TheEmpty
                            v-else
                            description="Нет категорий доходов. Добавьте категории в настройках бюджета."
                        />
                    </div>
                </TabPane>
            </TheTabs>
        </ThePageDataBoundary>

        <TheDrawer
            v-model:open="drawerOpen"
            :title="editingItem ? 'Редактировать лимит' : 'Добавить лимит'"
            width="400"
        >
            <PlanItemForm
                :key="editingItem?.id ?? preselectedCategoryId ?? 'new'"
                :category-options="currentCategoryOptions"
                hide-category-select
                :initial-values="
                    editingItem
                        ? {
                              categoryId: editingItem.categoryId,
                              limitRub: parseFloat(editingItem.plannedAmount) || 0
                          }
                        : preselectedCategoryId
                          ? { categoryId: preselectedCategoryId, limitRub: 0 }
                          : undefined
                "
                @submit="handleFormSubmit"
            />
        </TheDrawer>
    </div>
</template>

<style scoped>
.budget-plans-page {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-height: 0;
}

.budget-plans-page__period {
    flex-shrink: 0;
}

.budget-plans-page__tabs {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
}

.budget-plans-page__tabs :deep(.ant-tabs-content) {
    flex: 1;
    min-height: 0;
}

.budget-plans-page__tabs :deep(.ant-tabs-tabpane) {
    height: 100%;
}

.budget-plans-page__tab-content {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
}
</style>
