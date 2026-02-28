<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import { CategoryCard } from '@/features/category/category-card'
import { CategoryForm } from '@/features/category/category-form'
import type { CategoryFormValues } from '@/features/category/category-form'

import { useBudgetStore } from '@/entities/budget'
import { useCategoryStore } from '@/entities/category'
import type { Category, CategoryType } from '@/entities/category'
import { createCategory, updateCategory, deleteCategory } from '@/entities/category/api'
import { useMonthlyPlanStore } from '@/entities/monthly-plan'
import { useTransactionStore } from '@/entities/transaction'

import { ROUTE_NAMES } from '@/shared/config/router'
import { confirm } from '@/shared/lib/confirm'
import { getCurrentMonth, getMonthRange } from '@/shared/lib/date'
import { message } from '@/shared/lib/message'
import { usePageData } from '@/shared/lib/usePageData'
import {
    TheCreateButton,
    TheButton,
    TheDrawer,
    TheDivider,
    ThePageDataBoundary,
    ThePageHeader,
    TheTable
} from '@/shared/ui'

const router = useRouter()
const budgetStore = useBudgetStore()
const categoryStore = useCategoryStore()
const monthlyPlanStore = useMonthlyPlanStore()
const transactionStore = useTransactionStore()

/** Десктоп: ≥768px — используем drawer; мобилка — навигация на отдельные страницы. */
const isDesktop = useMediaQuery('(min-width: 768px)')

const drawerOpen = ref(false)
const editingCategory = ref<Category | null>(null)
const submitLoading = ref(false)

const hasBudget = computed(() => !!budgetStore.currentBudgetId)
const columns = [
    { title: 'Название', dataIndex: 'name', key: 'name' },
    { title: 'Тип', dataIndex: 'type', key: 'type', width: 120 },
    { title: 'Цвет', dataIndex: 'color', key: 'color', width: 100 },
    { title: '', key: 'action', width: 160, align: 'right' as const }
]

function openCreate() {
    if (!isDesktop.value) {
        router.push({ name: ROUTE_NAMES.CATEGORY_CREATE })
        return
    }
    editingCategory.value = null
    drawerOpen.value = true
}

function openEdit(record: Category) {
    if (!isDesktop.value) {
        router.push({ name: ROUTE_NAMES.CATEGORY_EDIT, params: { id: record.id } })
        return
    }
    editingCategory.value = record
    drawerOpen.value = true
}

async function handleFormSubmit(values: CategoryFormValues) {
    const budgetId = budgetStore.currentBudgetId
    if (!budgetId) return
    submitLoading.value = true
    try {
        if (editingCategory.value) {
            await updateCategory(editingCategory.value.id, values)
            categoryStore.setCategory({ ...editingCategory.value, ...values } as Category)
            message.success('Категория обновлена')
        } else {
            const created = await createCategory({ budgetId, ...values })
            categoryStore.setCategory(created as Category)
            message.success('Категория создана')
        }
        drawerOpen.value = false
    } finally {
        submitLoading.value = false
    }
}

/** Возвращает true, если категория удалена; false при отмене или ошибке. */
async function handleDelete(record: Category): Promise<boolean> {
    const ok = await confirm({
        title: 'Удалить категорию?',
        content: `«${record.name}» будет удалена.`,
        type: 'warning',
        positiveText: 'Удалить'
    })
    if (!ok) return false
    try {
        await deleteCategory(record.id)
        categoryStore.removeCategory(record.id)
        message.success('Категория удалена')
        return true
    } catch {
        message.error('Не удалось удалить категорию')
        return false
    }
}

async function handleDeleteFromDrawer() {
    const cat = editingCategory.value
    if (!cat) return
    const deleted = await handleDelete(cat)
    if (deleted) drawerOpen.value = false
}

function typeLabel(type: string) {
    const labels: Record<string, string> = {
        income: 'Доход',
        expense: 'Расход',
        transfer: 'Перевод',
        saving: 'Накопление'
    }
    return labels[type] ?? type
}

const CATEGORY_TYPE_ORDER: CategoryType[] = ['expense', 'income', 'transfer', 'saving']

const currentMonth = computed(() => getCurrentMonth())
const monthRange = computed(() => getMonthRange(currentMonth.value))

/** Категории с процентом заполнения (факт/план за текущий месяц) для грида. */
const categoriesWithPercent = computed(() => {
    const categories = categoryStore.categories ?? []
    const planItems = monthlyPlanStore.planItems ?? []
    const transactions = transactionStore.transactions ?? []
    const { from, to } = monthRange.value

    const plannedByCategory: Record<string, number> = {}
    for (const item of planItems) {
        const planned = parseFloat(item.plannedAmount) || 0
        plannedByCategory[item.categoryId] = (plannedByCategory[item.categoryId] ?? 0) + planned
    }

    const actualByCategory: Record<string, number> = {}
    for (const t of transactions) {
        if (t.type !== 'expense' || t.categoryId == null) continue
        const occurred = t.occurredAt?.slice(0, 10)
        if (occurred == null || occurred < from || occurred > to) continue
        const amount = parseFloat(t.amount) || 0
        actualByCategory[t.categoryId] = (actualByCategory[t.categoryId] ?? 0) + amount
    }

    return categories.map((cat) => {
        const planned = plannedByCategory[cat.id] ?? 0
        const actual = actualByCategory[cat.id] ?? 0
        const fillPercent = planned > 0 ? Math.min(100, (actual / planned) * 100) : 0
        return { category: cat, fillPercent }
    })
})

/** Группы категорий по типу (расход, доход, перевод, накопление) для отображения с TheDivider. */
const categoriesByType = computed(() => {
    const withPercent = categoriesWithPercent.value
    const byType = new Map<CategoryType, typeof withPercent>()
    for (const type of CATEGORY_TYPE_ORDER) {
        const items = withPercent.filter((p) => p.category.type === type)
        if (items.length > 0) byType.set(type, items)
    }
    return CATEGORY_TYPE_ORDER.filter((t) => byType.has(t)).map((type) => ({
        type,
        label: typeLabel(type),
        items: byType.get(type)!
    }))
})

async function load() {
    const budgetId = budgetStore.currentBudgetId
    if (!budgetId) return
    const { from, to } = monthRange.value
    const [year, month] = currentMonth.value.split('-').map(Number)
    await Promise.all([
        categoryStore.fetchCategories(budgetId),
        monthlyPlanStore.fetchMonthlyPlan(budgetId, year, month),
        transactionStore.fetchTransactions(budgetId, { from, to })
    ])
}

const { loading, error } = usePageData(load, {
    watchSources: [() => budgetStore.currentBudgetId, () => currentMonth.value]
})
</script>

<template>
    <div class="categories-page">
        <ThePageHeader title="Категории">
            <template #extra>
                <TheCreateButton
                    v-if="hasBudget"
                    label="Создать категорию"
                    @click="openCreate"
                />
            </template>
        </ThePageHeader>

        <ThePageDataBoundary
            :loading="loading"
            :has-budget="hasBudget"
            :error="error"
        >
            <template
                v-for="(group, groupIndex) in categoriesByType"
                :key="group.type"
            >
                <TheDivider v-if="groupIndex > 0" />
                <div class="categories-page__grid">
                    <CategoryCard
                        v-for="{ category, fillPercent } in group.items"
                        :key="category.id"
                        :category="category"
                        :fill-percent="fillPercent"
                        @edit="openEdit"
                    />
                </div>
            </template>
            <div class="categories-page__table">
                <template
                    v-for="group in categoriesByType"
                    :key="group.type"
                >
                    <TheDivider orientation="left">
                        {{ group.label }}
                    </TheDivider>
                    <TheTable
                        :columns="columns"
                        :data-source="group.items.map((i) => i.category)"
                        :loading="loading"
                        row-key="id"
                        :action-handlers="{
                            onEdit: (r) => openEdit(r as unknown as Category),
                            onDelete: (r) => handleDelete(r as unknown as Category)
                        }"
                    >
                        <template #bodyCell="{ column, record }">
                            <template v-if="column?.key === 'type'">
                                {{ typeLabel(record.type) }}
                            </template>
                            <template v-else-if="column?.key === 'color'">
                                <span
                                    v-if="(record as Category).color"
                                    class="categories-page__color"
                                    :style="{ backgroundColor: (record as Category).color! }"
                                />
                                <span v-else>—</span>
                            </template>
                        </template>
                    </TheTable>
                </template>
            </div>
        </ThePageDataBoundary>

        <TheDrawer
            v-model:open="drawerOpen"
            :title="editingCategory ? 'Редактировать категорию' : 'Создать категорию'"
            width="400"
        >
            <div class="categories-page__drawer-content">
                <CategoryForm
                    :key="editingCategory?.id ?? 'new'"
                    :initial-values="
                        editingCategory
                            ? {
                                  name: editingCategory.name,
                                  type: editingCategory.type,
                                  parentId: editingCategory.parentId,
                                  color: editingCategory.color,
                                  icon: editingCategory.icon
                              }
                            : undefined
                    "
                    @submit="handleFormSubmit"
                />
                <TheButton
                    v-if="editingCategory"
                    type="text"
                    danger
                    class="categories-page__drawer-delete"
                    @click="handleDeleteFromDrawer"
                >
                    Удалить категорию
                </TheButton>
            </div>
        </TheDrawer>
    </div>
</template>

<style scoped>
.categories-page {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-height: 0;
}

/* Мобильные и планшеты: грид категорий */
.categories-page__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(2.75rem + 16px, 100%), 1fr));
    gap: 16px;
}

.categories-page__table {
    display: none;
}

/* Десктоп: таблица */
@media (min-width: 768px) {
    .categories-page__grid {
        display: none;
    }

    .categories-page__table {
        display: block;
    }
}

.categories-page__color {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    vertical-align: middle;
}

.categories-page__drawer-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.categories-page__drawer-delete {
    margin-top: 8px;
    align-self: flex-start;
}
</style>
