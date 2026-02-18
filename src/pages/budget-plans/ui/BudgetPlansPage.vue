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
import { message } from '@/shared/lib/message'
import { TheButton, TheDrawer, TheEmpty, ThePageHeader, TheSpin, TheTable } from '@/shared/ui'

const budgetStore = useBudgetStore()
const categoryStore = useCategoryStore()
const monthlyPlanStore = useMonthlyPlanStore()

const drawerOpen = ref(false)
const editingItem = ref<MonthlyPlanItem | null>(null)
const loading = ref(true)
const submitLoading = ref(false)

const currentYear = computed(() => new Date().getFullYear())
const currentMonthNum = computed(() => new Date().getMonth() + 1)
/** Текущий месяц в формате YYYY-MM (для отображения) */
const currentMonthLabel = computed(() => `${currentYear.value}-${String(currentMonthNum.value).padStart(2, '0')}`)

const hasBudget = computed(() => !!budgetStore.currentBudgetId)

/** Категории типа «расход» для выбора лимита */
const expenseCategoryOptions = computed(() => {
    const list = categoryStore.categories ?? []
    return list.filter((c) => c.type === 'expense').map((c) => ({ label: c.name, value: c.id }))
})

const columns = [
    { title: 'Категория', dataIndex: 'categoryId', key: 'categoryId' },
    { title: 'Лимит', dataIndex: 'plannedAmount', key: 'plannedAmount', width: 140 },
    { title: '', key: 'action', width: 160, align: 'right' as const }
]

function categoryName(categoryId: string) {
    const list = categoryStore.categories ?? []
    return list.find((c) => c.id === categoryId)?.name ?? categoryId
}

/** plannedAmount в API — строка (рубли); форматируем для отображения */
function formatPlannedAmount(plannedAmount: string) {
    const rub = parseFloat(plannedAmount) || 0
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(rub)
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
    const year = currentYear.value
    const month = currentMonthNum.value
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
        await monthlyPlanStore.fetchMonthlyPlan(budgetId, currentYear.value, currentMonthNum.value)
    } finally {
        loading.value = false
    }
}

onMounted(load)
watch(() => budgetStore.currentBudgetId, load)
</script>

<template>
    <div class="budget-plans-page">
        <ThePageHeader title="Планы по бюджету">
            <template #extra>
                <TheButton
                    v-if="hasBudget"
                    type="primary"
                    @click="openCreate"
                >
                    Добавить лимит
                </TheButton>
            </template>
        </ThePageHeader>

        <TheSpin :spinning="loading">
            <template v-if="!hasBudget">
                <TheEmpty description="Выберите бюджет" />
            </template>
            <template v-else>
                <p class="budget-plans-page__month">Месяц: {{ currentMonthLabel }}</p>
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
                        <template v-else-if="column?.key === 'plannedAmount'">
                            {{ formatPlannedAmount(record.plannedAmount) }}
                        </template>
                        <template v-else-if="column?.key === 'action'">
                            <span class="budget-plans-page__actions">
                                <TheButton
                                    type="link"
                                    size="small"
                                    @click="openEdit(record as MonthlyPlanItem)"
                                >
                                    Изменить
                                </TheButton>
                                <TheButton
                                    type="link"
                                    size="small"
                                    danger
                                    @click="handleDelete(record as MonthlyPlanItem)"
                                >
                                    Удалить
                                </TheButton>
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
                              limitRub: parseFloat(editingItem.plannedAmount) || 0
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

.budget-plans-page__month {
    margin: 0;
    color: var(--color-text-secondary, #666);
}

.budget-plans-page__actions {
    display: flex;
    gap: 8px;
}
</style>
