import { defineStore } from 'pinia'
import { ref } from 'vue'

import * as monthlyPlanApi from '../api'

import type { MonthlyPlan, MonthlyPlanItem } from './types'

export const useMonthlyPlanStore = defineStore('monthlyPlan', () => {
    const currentPlan = ref<MonthlyPlan | null>(null)
    const planItems = ref<MonthlyPlanItem[]>([])

    function setCurrentPlan(plan: MonthlyPlan | null) {
        currentPlan.value = plan
    }

    function setPlanItems(items: MonthlyPlanItem[]) {
        planItems.value = items
    }

    function setPlanItem(item: MonthlyPlanItem) {
        const index = planItems.value.findIndex((i) => i.id === item.id)
        if (index >= 0) {
            planItems.value[index] = item
        } else {
            planItems.value.push(item)
        }
    }

    function removePlanItem(id: string) {
        planItems.value = planItems.value.filter((i) => i.id !== id)
    }

    async function fetchMonthlyPlan(budgetId: string, year: number, month: number) {
        const plan = await monthlyPlanApi.fetchMonthlyPlan(budgetId, year, month)
        setCurrentPlan(plan)
        if (plan) {
            const items = await monthlyPlanApi.fetchMonthlyPlanItems(plan.id)
            setPlanItems(items)
        } else {
            setPlanItems([])
        }
        return plan
    }

    return {
        currentPlan,
        planItems,
        setCurrentPlan,
        setPlanItems,
        setPlanItem,
        removePlanItem,
        fetchMonthlyPlan
    }
})
