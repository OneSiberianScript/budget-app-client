import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import type { BudgetRole } from '@/shared/lib/budget-role'

import * as budgetApi from '../api'

import type { Budget } from './types'

const STORAGE_KEY = 'budget_currentBudgetId'

export const useBudgetStore = defineStore('budget', () => {
    const budgets = ref<Budget[]>([])
    const currentBudgetId = ref<string | null>(null)
    const currentBudgetRole = ref<BudgetRole | null>(null)

    const currentBudget = computed(() => {
        const id = currentBudgetId.value
        return id ? (budgets.value.find((b) => b.id === id) ?? null) : null
    })

    const hasBudgetSelected = computed(() => !!currentBudgetId.value)

    function setCurrentBudget(budgetId: string | null, role: BudgetRole | null = null) {
        currentBudgetId.value = budgetId
        currentBudgetRole.value = role
        try {
            if (budgetId) {
                sessionStorage.setItem(STORAGE_KEY, budgetId)
            } else {
                sessionStorage.removeItem(STORAGE_KEY)
            }
        } catch {
            // ignore
        }
    }

    function setBudgets(list: Budget[]) {
        budgets.value = list
    }

    function setBudget(budget: Budget) {
        const index = budgets.value.findIndex((b) => b.id === budget.id)
        if (index >= 0) {
            budgets.value[index] = budget
        } else {
            budgets.value.push(budget)
        }
    }

    function removeBudget(id: string) {
        budgets.value = budgets.value.filter((b) => b.id !== id)
        if (currentBudgetId.value === id) {
            currentBudgetId.value = null
            currentBudgetRole.value = null
        }
    }

    function hydrateFromStorage() {
        try {
            const id = sessionStorage.getItem(STORAGE_KEY)
            if (id) {
                currentBudgetId.value = id
                // Role will be set when budget/member is loaded
            }
        } catch {
            // ignore
        }
    }

    async function fetchBudgets() {
        try {
            const list = await budgetApi.fetchBudgets()
            const safeList = Array.isArray(list) ? list : []
            setBudgets(safeList)
            const currentId = currentBudgetId.value
            if (currentId && !safeList.some((b) => b.id === currentId)) {
                currentBudgetId.value = null
                currentBudgetRole.value = null
            }
            if (!currentBudgetId.value && safeList.length > 0) {
                setCurrentBudget(safeList[0].id, null)
            }
            return safeList
        } catch {
            setBudgets([])
            return []
        }
    }

    return {
        budgets,
        currentBudgetId,
        currentBudgetRole,
        currentBudget,
        hasBudgetSelected,
        setCurrentBudget,
        setBudgets,
        setBudget,
        removeBudget,
        hydrateFromStorage,
        fetchBudgets
    }
})
