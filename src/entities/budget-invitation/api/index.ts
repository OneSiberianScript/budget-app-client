import { request } from '@/shared/api/request'
import type { BudgetInvitationCreate } from '@/shared/types'

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
export async function createBudgetInvitation(payload: BudgetInvitationCreate): Promise<BudgetInvitation> {
    return request<BudgetInvitation>({ method: 'POST', url: '/budget-invitations', data: payload })
}

/**
 * Cancel/revoke an invitation.
 */
export async function revokeBudgetInvitation(id: string): Promise<void> {
    await request({ method: 'DELETE', url: `/budget-invitations/${id}` })
}

/**
 * Приём приглашения по токену в openapi.yaml не описан — эндпоинт accept отсутствует в спецификации.
 * При появлении эндпоинта в спецификации реализовать вызов здесь.
 */
