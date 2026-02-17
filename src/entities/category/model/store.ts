import { defineStore } from 'pinia'
import { ref } from 'vue'

import * as categoryApi from '../api'

import type { Category } from './types'

export const useCategoryStore = defineStore('category', () => {
    const categories = ref<Category[]>([])

    function setCategories(list: Category[]) {
        categories.value = list
    }

    function setCategory(category: Category) {
        const index = categories.value.findIndex((c) => c.id === category.id)
        if (index >= 0) {
            categories.value[index] = category
        } else {
            categories.value.push(category)
        }
    }

    function removeCategory(id: string) {
        categories.value = categories.value.filter((c) => c.id !== id)
    }

    async function fetchCategories(budgetId: string) {
        const list = await categoryApi.fetchCategories(budgetId)
        setCategories(list)
        return list
    }

    return {
        categories,
        setCategories,
        setCategory,
        removeCategory,
        fetchCategories
    }
})
