<script setup lang="ts">
import { useRouter } from 'vue-router'

import { CategoryForm } from '@/features/category/category-form'
import type { CategoryFormValues } from '@/features/category/category-form'

import { useBudgetStore } from '@/entities/budget'
import { useCategoryStore } from '@/entities/category'
import type { Category } from '@/entities/category'
import { createCategory } from '@/entities/category/api'

import { ROUTE_NAMES } from '@/shared/config/router'
import { message } from '@/shared/lib/message'
import { ThePageHeader } from '@/shared/ui'

const router = useRouter()
const budgetStore = useBudgetStore()
const categoryStore = useCategoryStore()

async function handleSubmit(values: CategoryFormValues) {
    const budgetId = budgetStore.currentBudgetId
    if (!budgetId) return
    const created = await createCategory({ budgetId, ...values })
    categoryStore.setCategory(created as Category)
    message.success('Категория создана')
    router.push({ name: ROUTE_NAMES.CATEGORIES })
}
</script>

<template>
    <div class="category-create-page">
        <ThePageHeader title="Создать категорию" />
        <CategoryForm
            grid-pickers
            @submit="handleSubmit"
        />
    </div>
</template>

<style scoped>
.category-create-page {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>
