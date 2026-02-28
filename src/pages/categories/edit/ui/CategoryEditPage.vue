<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { CategoryForm } from '@/features/category/category-form'
import type { CategoryFormValues } from '@/features/category/category-form'

import { useCategoryStore } from '@/entities/category'
import type { Category } from '@/entities/category'
import { deleteCategory, updateCategory } from '@/entities/category/api'

import { ROUTE_NAMES } from '@/shared/config/router'
import { confirm } from '@/shared/lib/confirm'
import { message } from '@/shared/lib/message'
import { TheButton, ThePageHeader, TheSpin } from '@/shared/ui'

const route = useRoute()
const router = useRouter()
const categoryStore = useCategoryStore()

const categoryId = computed(() => route.params.id as string)

const category = computed(() => categoryStore.categories?.find((c) => c.id === categoryId.value) ?? null)

const isLoading = ref(false)

async function handleSubmit(values: CategoryFormValues) {
    const cat = category.value
    if (!cat) return
    isLoading.value = true
    try {
        await updateCategory(cat.id, values)
        categoryStore.setCategory({ ...cat, ...values } as Category)
        message.success('Категория обновлена')
        router.push({ name: ROUTE_NAMES.CATEGORIES })
    } finally {
        isLoading.value = false
    }
}

async function handleDelete() {
    const cat = category.value
    if (!cat) return
    const ok = await confirm({
        title: 'Удалить категорию?',
        content: `«${cat.name}» будет удалена.`,
        type: 'warning',
        positiveText: 'Удалить'
    })
    if (!ok) return
    try {
        await deleteCategory(cat.id)
        categoryStore.removeCategory(cat.id)
        message.success('Категория удалена')
        router.push({ name: ROUTE_NAMES.CATEGORIES })
    } catch {
        message.error('Не удалось удалить категорию')
    }
}
</script>

<template>
    <div class="category-edit-page">
        <ThePageHeader title="Редактировать категорию" />

        <TheSpin
            v-if="!category"
            :spinning="true"
        />

        <template v-else>
            <CategoryForm
                :key="category.id"
                grid-pickers
                :initial-values="{
                    name: category.name,
                    type: category.type,
                    parentId: category.parentId,
                    color: category.color,
                    icon: category.icon
                }"
                @submit="handleSubmit"
            />
            <TheButton
                type="text"
                danger
                class="category-edit-page__delete"
                @click="handleDelete"
            >
                Удалить категорию
            </TheButton>
        </template>
    </div>
</template>

<style scoped>
.category-edit-page {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.category-edit-page__delete {
    align-self: flex-start;
    margin-top: 8px;
}
</style>
