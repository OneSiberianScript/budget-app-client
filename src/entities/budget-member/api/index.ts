import { request } from '@/shared/api/request'

import type { BudgetMember } from '../model/types'

/**
 * Fetch members of a budget.
 */
export async function fetchBudgetMembers(budgetId: string): Promise<BudgetMember[]> {
    const data = await request<BudgetMember[]>({
        method: 'GET',
        url: '/budget-members',
        params: { budgetId }
    })
    return data
}

/**
 * Update a member's role.
 */
export async function updateBudgetMember(id: string, payload: { role: BudgetMember['role'] }): Promise<BudgetMember> {
    return request<BudgetMember>({ method: 'PATCH', url: `/budget-members/${id}`, data: payload })
}

/**
 * Remove a member from the budget.
 */
export async function removeBudgetMember(id: string): Promise<void> {
    await request({ method: 'DELETE', url: `/budget-members/${id}` })
}
