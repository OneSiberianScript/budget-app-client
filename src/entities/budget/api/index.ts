import { request } from '@/shared/api/request'
import type { BudgetCreate, BudgetUpdate } from '@/shared/types'

import type { Budget } from '../model/types'

/**
 * Fetch all budgets for the current user.
 */
export async function fetchBudgets(): Promise<Budget[]> {
    const data = await request<Budget[]>({ method: 'GET', url: '/budgets' })
    return data
}

/**
 * Fetch a single budget by id.
 */
export async function fetchBudgetById(id: string): Promise<Budget> {
    return request<Budget>({ method: 'GET', url: `/budgets/${id}` })
}

/**
 * Create a new budget.
 */
export async function createBudget(payload: BudgetCreate): Promise<Budget> {
    return request<Budget>({ method: 'POST', url: '/budgets', data: payload })
}

/**
 * Update a budget.
 */
export async function updateBudget(id: string, payload: BudgetUpdate): Promise<Budget> {
    return request<Budget>({ method: 'PATCH', url: `/budgets/${id}`, data: payload })
}

/**
 * Delete a budget.
 */
export async function deleteBudget(id: string): Promise<void> {
    return request({ method: 'DELETE', url: `/budgets/${id}` })
}
