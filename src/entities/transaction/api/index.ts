import { request } from '@/shared/api/request'

import type { Transaction } from '../model/types'

/**
 * Fetch transactions for a budget (optional filters).
 */
export async function fetchTransactions(
    budgetId: string,
    params?: { accountId?: string; categoryId?: string; from?: string; to?: string }
): Promise<Transaction[]> {
    const data = await request<Transaction[]>({
        method: 'GET',
        url: '/transactions',
        params: { budgetId, ...params }
    })
    return data
}

/**
 * Fetch a single transaction by id.
 */
export async function fetchTransactionById(id: string): Promise<Transaction> {
    return request<Transaction>({ method: 'GET', url: `/transactions/${id}` })
}

/**
 * Create a transaction.
 */
export async function createTransaction(payload: {
    budgetId: string
    accountId: string
    categoryId: string
    amount: number
    date: string
    note?: string
}): Promise<Transaction> {
    return request<Transaction>({ method: 'POST', url: '/transactions', data: payload })
}

/**
 * Update a transaction.
 */
export async function updateTransaction(
    id: string,
    payload: Partial<Pick<Transaction, 'accountId' | 'categoryId' | 'amount' | 'date' | 'note'>>
): Promise<Transaction> {
    return request<Transaction>({ method: 'PATCH', url: `/transactions/${id}`, data: payload })
}

/**
 * Delete a transaction.
 */
export async function deleteTransaction(id: string): Promise<void> {
    await request({ method: 'DELETE', url: `/transactions/${id}` })
}
