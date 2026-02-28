import { request } from '@/shared/api/request'
import type { AcceptInvitationResponse, BudgetInvitationCreate, BudgetInvitationRole } from '@/shared/types'

import type { BudgetInvitation } from '../model/types'

/**
 * Получить список приглашений бюджета.
 */
export async function fetchBudgetInvitations(budgetId: string): Promise<BudgetInvitation[]> {
    return request<BudgetInvitation[]>({ method: 'GET', url: '/budget-invitations', params: { budgetId } })
}

/**
 * Получить приглашение по ID (токену из письма).
 */
export async function getInvitationById(id: string): Promise<BudgetInvitation> {
    return request<BudgetInvitation>({ method: 'GET', url: `/budget-invitations/${id}` })
}

/**
 * Создать приглашение (только owner).
 */
export async function createBudgetInvitation(payload: BudgetInvitationCreate): Promise<BudgetInvitation> {
    return request<BudgetInvitation>({ method: 'POST', url: '/budget-invitations', data: payload })
}

/**
 * Изменить роль в приглашении (только пока status === 'pending', только owner).
 */
export async function updateInvitationRole(id: string, role: BudgetInvitationRole): Promise<BudgetInvitation> {
    return request<BudgetInvitation>({ method: 'PATCH', url: `/budget-invitations/${id}`, data: { role } })
}

/**
 * Отозвать приглашение (только owner).
 */
export async function revokeBudgetInvitation(id: string): Promise<void> {
    await request({ method: 'DELETE', url: `/budget-invitations/${id}` })
}

/**
 * Принять приглашение (вызывает сам приглашённый).
 * Возвращает budgetId и роль, с которой пользователь вошёл в бюджет.
 */
export async function acceptInvitation(id: string): Promise<AcceptInvitationResponse> {
    return request<AcceptInvitationResponse>({ method: 'POST', url: `/budget-invitations/${id}/accept` })
}

/**
 * Отклонить приглашение (вызывает сам приглашённый).
 */
export async function rejectInvitation(id: string): Promise<{ ok: true }> {
    return request<{ ok: true }>({ method: 'POST', url: `/budget-invitations/${id}/reject` })
}
