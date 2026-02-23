<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

import { CategoryForm } from '@/features/category/category-form'
import type { CategoryFormValues } from '@/features/category/category-form'

import { useBudgetStore } from '@/entities/budget'
import { useCategoryStore } from '@/entities/category'
import type { Category } from '@/entities/category'
import { createCategory, updateCategory, deleteCategory } from '@/entities/category/api'

import { confirm } from '@/shared/lib/confirm'
import { message } from '@/shared/lib/message'
import { TheButton, TheDrawer, TheEmpty, ThePageHeader, TheSpin, TheTable } from '@/shared/ui'

const budgetStore = useBudgetStore()
const categoryStore = useCategoryStore()

const drawerOpen = ref(false)
const editingCategory = ref<Category | null>(null)
const loading = ref(true)
const submitLoading = ref(false)

const hasBudget = computed(() => !!budgetStore.currentBudgetId)
const columns = [
    { title: 'Название', dataIndex: 'name', key: 'name' },
    { title: 'Тип', dataIndex: 'type', key: 'type', width: 120 },
    { title: 'Цвет', dataIndex: 'color', key: 'color', width: 100 },
    { title: '', key: 'action', width: 160, align: 'right' as const }
]

function openCreate() {
    editingCategory.value = null
    drawerOpen.value = true
}

function openEdit(record: Category) {
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

async function handleDelete(record: Category) {
    const ok = await confirm({
        title: 'Удалить категорию?',
        content: `«${record.name}» будет удалена.`,
        type: 'warning',
        positiveText: 'Удалить'
    })
    if (!ok) return
    try {
        await deleteCategory(record.id)
        categoryStore.removeCategory(record.id)
        message.success('Категория удалена')
    } catch {
        message.error('Не удалось удалить категорию')
    }
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

async function load() {
    const budgetId = budgetStore.currentBudgetId
    if (!budgetId) {
        loading.value = false
        return
    }
    loading.value = true
    try {
        await categoryStore.fetchCategories(budgetId)
    } finally {
        loading.value = false
    }
}

onMounted(load)
watch(() => budgetStore.currentBudgetId, load)
</script>

<template>
    <div class="categories-page">
        <ThePageHeader title="Категории">
            <template #extra>
                <TheButton
                    v-if="hasBudget"
                    type="primary"
                    @click="openCreate"
                >
                    Создать категорию
                </TheButton>
            </template>
        </ThePageHeader>

        <TheSpin :spinning="loading">
            <template v-if="!hasBudget">
                <TheEmpty description="Выберите бюджет" />
            </template>
            <template v-else>
                <TheTable
                    :columns="columns"
                    :data-source="categoryStore.categories"
                    :loading="loading"
                    row-key="id"
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
                        <template v-else-if="column?.key === 'action'">
                            <span class="categories-page__actions">
                                <TheButton
                                    type="link"
                                    size="small"
                                    @click="openEdit(record as Category)"
                                >
                                    Изменить
                                </TheButton>
                                <TheButton
                                    type="link"
                                    size="small"
                                    danger
                                    @click="handleDelete(record as Category)"
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
            :title="editingCategory ? 'Редактировать категорию' : 'Создать категорию'"
            width="400"
        >
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

.categories-page__actions {
    display: flex;
    gap: 8px;
}

.categories-page__color {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    vertical-align: middle;
}
</style>
