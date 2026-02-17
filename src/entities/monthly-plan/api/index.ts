import { request } from '@/shared/api/request'

import type { MonthlyPlan, MonthlyPlanItem } from '../model/types'

/**
 * Fetch monthly plan for a budget and month.
 */
export async function fetchMonthlyPlan(budgetId: string, month: string): Promise<MonthlyPlan | null> {
    const data = await request<MonthlyPlan | null>({
        method: 'GET',
        url: '/monthly-plans',
        params: { budgetId, month }
    })
    return data
}

/**
 * Fetch items (category limits) for a monthly plan.
 */
export async function fetchMonthlyPlanItems(monthlyPlanId: string): Promise<MonthlyPlanItem[]> {
    const data = await request<MonthlyPlanItem[]>({
        method: 'GET',
        url: '/monthly-plans/items',
        params: { monthlyPlanId }
    })
    return data
}

/**
 * Create or get monthly plan for budget + month.
 */
export async function createMonthlyPlan(payload: { budgetId: string; month: string }): Promise<MonthlyPlan> {
    return request<MonthlyPlan>({ method: 'POST', url: '/monthly-plans', data: payload })
}

/**
 * Create a monthly plan item (category limit).
 */
export async function createMonthlyPlanItem(payload: {
    monthlyPlanId: string
    categoryId: string
    limitCents: number
}): Promise<MonthlyPlanItem> {
    return request<MonthlyPlanItem>({ method: 'POST', url: '/monthly-plans/items', data: payload })
}

/**
 * Update a monthly plan item (category limit).
 */
export async function updateMonthlyPlanItem(id: string, payload: { limitCents: number }): Promise<MonthlyPlanItem> {
    return request<MonthlyPlanItem>({ method: 'PATCH', url: `/monthly-plans/items/${id}`, data: payload })
}

/**
 * Delete a monthly plan item.
 */
export async function deleteMonthlyPlanItem(id: string): Promise<void> {
    await request({ method: 'DELETE', url: `/monthly-plans/items/${id}` })
}
