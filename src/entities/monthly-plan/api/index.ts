import { request } from '@/shared/api/request'
import type {
    MonthlyPlan,
    MonthlyPlanCreate,
    MonthlyPlanItem,
    MonthlyPlanItemCreate,
    MonthlyPlanItemUpdate
} from '@/shared/types'

/**
 * Fetch monthly plan for a budget and year/month (openapi: GET /monthly-plans returns array; find on client).
 */
export async function fetchMonthlyPlan(budgetId: string, year: number, month: number): Promise<MonthlyPlan | null> {
    const data = await request<MonthlyPlan[]>({ method: 'GET', url: '/monthly-plans' })
    return data.find((p) => p.budgetId === budgetId && p.year === year && p.month === month) ?? null
}

/**
 * Fetch items for a monthly plan (openapi: GET /monthly-plan-items returns array; filter on client).
 */
export async function fetchMonthlyPlanItems(monthlyPlanId: string): Promise<MonthlyPlanItem[]> {
    const data = await request<MonthlyPlanItem[]>({ method: 'GET', url: '/monthly-plan-items' })
    return data.filter((i) => i.monthlyPlanId === monthlyPlanId)
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
