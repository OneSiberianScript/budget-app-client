import { request } from '@/shared/api/request'
import type { AccountCreate, AccountUpdate } from '@/shared/types'

import type { Account } from '../model/types'

/**
 * Fetch accounts for a budget.
 */
export async function fetchAccounts(budgetId: string): Promise<Account[]> {
    const data = await request<Account[]>({ method: 'GET', url: '/accounts', params: { budgetId } })
    return data
}

/**
 * Fetch a single account by id.
 */
export async function fetchAccountById(id: string): Promise<Account> {
    return request<Account>({ method: 'GET', url: `/accounts/${id}` })
}

/**
 * Create an account.
 */
export async function createAccount(payload: AccountCreate): Promise<Account> {
    return request<Account>({ method: 'POST', url: '/accounts', data: payload })
}

/**
 * Update an account.
 */
export async function updateAccount(id: string, payload: AccountUpdate): Promise<Account> {
    return request<Account>({ method: 'PATCH', url: `/accounts/${id}`, data: payload })
}

/**
 * Delete an account.
 */
export async function deleteAccount(id: string): Promise<void> {
    return request({ method: 'DELETE', url: `/accounts/${id}` })
}
