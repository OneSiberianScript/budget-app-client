import { request } from '@/shared/api/request'

import type { BudgetInvitation } from '../model/types'

/**
 * Fetch invitations for a budget.
 */
export async function fetchBudgetInvitations(budgetId: string): Promise<BudgetInvitation[]> {
    const data = await request<BudgetInvitation[]>({
        method: 'GET',
        url: '/budget-invitations',
        params: { budgetId }
    })
    return data
}

/**
 * Create an invitation (owner only).
 */
export async function createBudgetInvitation(payload: {
    budgetId: string
    email: string
    role: BudgetInvitation['role']
}): Promise<BudgetInvitation> {
    return request<BudgetInvitation>({ method: 'POST', url: '/budget-invitations', data: payload })
}

/**
 * Cancel/revoke an invitation.
 */
export async function revokeBudgetInvitation(id: string): Promise<void> {
    await request({ method: 'DELETE', url: `/budget-invitations/${id}` })
}

/**
 * Accept an invitation by token (from email link).
 */
export async function acceptBudgetInvitation(token: string): Promise<{ budgetId: string }> {
    return request<{ budgetId: string }>({
        method: 'POST',
        url: '/budget-invitations/accept',
        data: { token }
    })
}
