<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

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
    deleteMonthlyPlanItem,
    fetchMonthlyPlanItems
} from '@/entities/monthly-plan/api'

import { confirm } from '@/shared/lib/confirm'
import { formatMoneyFromCents } from '@/shared/lib/format-money'
import { message } from '@/shared/lib/message'
import { TheButton, TheDrawer, TheEmpty, TheSpin, TheTable } from '@/shared/ui'

const budgetStore = useBudgetStore()
const categoryStore = useCategoryStore()
const monthlyPlanStore = useMonthlyPlanStore()

const drawerOpen = ref(false)
const editingItem = ref<MonthlyPlanItem | null>(null)
const loading = ref(true)
const submitLoading = ref(false)

/** Текущий месяц в формате YYYY-MM */
const currentMonth = computed(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
})

const hasBudget = computed(() => !!budgetStore.currentBudgetId)

/** Категории типа «расход» для выбора лимита */
const expenseCategoryOptions = computed(() =>
    categoryStore.categories.filter((c) => c.type === 'expense').map((c) => ({ label: c.name, value: c.id }))
)

const columns = [
    { title: 'Категория', dataIndex: 'categoryId', key: 'categoryId' },
    { title: 'Лимит', dataIndex: 'limitCents', key: 'limitCents', width: 140 },
    { title: '', key: 'action', width: 160, align: 'right' as const }
]

function categoryName(categoryId: string) {
    return categoryStore.categories.find((c) => c.id === categoryId)?.name ?? categoryId
}

function openCreate() {
    editingItem.value = null
    drawerOpen.value = true
}

function openEdit(record: MonthlyPlanItem) {
    editingItem.value = record
    drawerOpen.value = true
}

async function ensurePlan() {
    const budgetId = budgetStore.currentBudgetId
    if (!budgetId) return null
    let plan = monthlyPlanStore.currentPlan
    if (!plan || plan.month !== currentMonth.value) {
        plan = await createMonthlyPlan({ budgetId, month: currentMonth.value })
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
        const limitCents = Math.round(values.limitRub * 100)
        if (editingItem.value) {
            await updateMonthlyPlanItem(editingItem.value.id, { limitCents })
            monthlyPlanStore.setPlanItem({ ...editingItem.value, limitCents } as MonthlyPlanItem)
            message.success('Лимит обновлён')
        } else {
            const created = await createMonthlyPlanItem({
                monthlyPlanId: plan.id,
                categoryId: values.categoryId,
                limitCents
            })
            monthlyPlanStore.setPlanItem(created as MonthlyPlanItem)
            message.success('Лимит добавлен')
        }
        drawerOpen.value = false
    } finally {
        submitLoading.value = false
    }
}

async function handleDelete(record: MonthlyPlanItem) {
    const name = categoryName(record.categoryId)
    const ok = await confirm({
        title: 'Удалить лимит?',
        content: `Лимит по категории «${name}» будет удалён.`,
        type: 'warning',
        positiveText: 'Удалить'
    })
    if (!ok) return
    try {
        await deleteMonthlyPlanItem(record.id)
        monthlyPlanStore.removePlanItem(record.id)
        message.success('Лимит удалён')
    } catch {
        message.error('Не удалось удалить лимит')
    }
}

async function load() {
    const budgetId = budgetStore.currentBudgetId
    if (!budgetId) {
        loading.value = false
        return
    }
    loading.value = true
    try {
        await categoryStore.fetchCategories(budgetId)
        await monthlyPlanStore.fetchMonthlyPlan(budgetId, currentMonth.value)
    } finally {
        loading.value = false
    }
}

onMounted(load)
watch(() => budgetStore.currentBudgetId, load)
</script>

<template>
    <div class="budget-plans-page">
        <div class="budget-plans-page__toolbar">
            <h1 class="budget-plans-page__title">Планы по бюджету</h1>
            <TheButton
                v-if="hasBudget"
                type="primary"
                @click="openCreate"
            >
                Добавить лимит
            </TheButton>
        </div>

        <TheSpin :spinning="loading">
            <template v-if="!hasBudget">
                <TheEmpty description="Выберите бюджет" />
            </template>
            <template v-else>
                <p class="budget-plans-page__month">Месяц: {{ currentMonth }}</p>
                <TheTable
                    :columns="columns"
                    :data-source="monthlyPlanStore.planItems"
                    :loading="loading"
                    row-key="id"
                >
                    <template #bodyCell="{ column, record }">
                        <template v-if="column?.key === 'categoryId'">
                            {{ categoryName(record.categoryId) }}
                        </template>
                        <template v-else-if="column?.key === 'limitCents'">
                            {{ formatMoneyFromCents(record.limitCents) }}
                        </template>
                        <template v-else-if="column?.key === 'action'">
                            <span class="budget-plans-page__actions">
                                <a-button
                                    type="link"
                                    size="small"
                                    @click="openEdit(record as MonthlyPlanItem)"
                                >
                                    Изменить
                                </a-button>
                                <a-button
                                    type="link"
                                    size="small"
                                    danger
                                    @click="handleDelete(record as MonthlyPlanItem)"
                                >
                                    Удалить
                                </a-button>
                            </span>
                        </template>
                    </template>
                </TheTable>
            </template>
        </TheSpin>

        <TheDrawer
            v-model:open="drawerOpen"
            :title="editingItem ? 'Редактировать лимит' : 'Добавить лимит'"
            width="400"
        >
            <PlanItemForm
                :key="editingItem?.id ?? 'new'"
                :category-options="expenseCategoryOptions"
                :initial-values="
                    editingItem
                        ? {
                              categoryId: editingItem.categoryId,
                              limitRub: editingItem.limitCents / 100
                          }
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

.budget-plans-page__toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
}

.budget-plans-page__title {
    margin: 0;
    font-size: 1.25rem;
}

.budget-plans-page__month {
    margin: 0;
    color: var(--color-text-secondary, #666);
}

.budget-plans-page__actions {
    display: flex;
    gap: 8px;
}
</style>
