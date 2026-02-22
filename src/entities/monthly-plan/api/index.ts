import { request } from '@/shared/api/request'
import type {
    MonthlyPlan,
    MonthlyPlanCreate,
    MonthlyPlanItem,
    MonthlyPlanItemCreate,
    MonthlyPlanItemUpdate
} from '@/shared/types'

/**
 * Fetch monthly plan for a budget and year/month.
 */
export async function fetchMonthlyPlan(budgetId: string, year: number, month: number): Promise<MonthlyPlan | null> {
    const data = await request<MonthlyPlan | null>({
        method: 'GET',
        url: '/monthly-plans',
        params: { budgetId, year, month }
    })
    return data
}

/**
 * Fetch items (category limits) for a monthly plan.
 */
export async function fetchMonthlyPlanItems(monthlyPlanId: string): Promise<MonthlyPlanItem[]> {
    const data = await request<MonthlyPlanItem[]>({
        method: 'GET',
        url: '/monthly-plan-items',
        params: { monthlyPlanId }
    })
    return data
}

/**
 * Create or get monthly plan for budget + year + month.
 */
export async function createMonthlyPlan(payload: MonthlyPlanCreate): Promise<MonthlyPlan> {
    return request<MonthlyPlan>({ method: 'POST', url: '/monthly-plans', data: payload })
}

/**
 * Create a monthly plan item (category limit).
 */
export async function createMonthlyPlanItem(payload: MonthlyPlanItemCreate): Promise<MonthlyPlanItem> {
    return request<MonthlyPlanItem>({ method: 'POST', url: '/monthly-plan-items', data: payload })
}

/**
 * Update a monthly plan item.
 */
export async function updateMonthlyPlanItem(id: string, payload: MonthlyPlanItemUpdate): Promise<MonthlyPlanItem> {
    return request<MonthlyPlanItem>({ method: 'PATCH', url: `/monthly-plan-items/${id}`, data: payload })
}

/**
 * Delete a monthly plan item.
 */
export async function deleteMonthlyPlanItem(id: string): Promise<void> {
    return request({ method: 'DELETE', url: `/monthly-plan-items/${id}` })
}
