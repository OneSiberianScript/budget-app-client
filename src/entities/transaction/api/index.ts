import { request } from '@/shared/api/request'
import type { TransactionCreate, TransactionUpdate } from '@/shared/types'

import type { Transaction } from '../model/types'

/**
 * Fetch all transactions (openapi: GET /transactions has no query params). Filter by budgetId and optional filters on the client.
 */
export async function fetchTransactions(
    budgetId: string,
    params?: { accountId?: string; categoryId?: string; from?: string; to?: string }
): Promise<Transaction[]> {
    const data = await request<Transaction[]>({ method: 'GET', url: '/transactions' })
    let list = data.filter((t) => t.budgetId === budgetId)
    if (params?.accountId) {
        list = list.filter((t) => t.debitAccountId === params.accountId || t.creditAccountId === params.accountId)
    }
    if (params?.categoryId) list = list.filter((t) => t.categoryId === params.categoryId)
    if (params?.from) list = list.filter((t) => t.occurredAt >= params.from!)
    if (params?.to) list = list.filter((t) => t.occurredAt <= params.to!)
    return list
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
export async function createTransaction(payload: TransactionCreate): Promise<Transaction> {
    return request<Transaction>({ method: 'POST', url: '/transactions', data: payload })
}

/**
 * Update a transaction.
 */
export async function updateTransaction(id: string, payload: TransactionUpdate): Promise<Transaction> {
    return request<Transaction>({ method: 'PATCH', url: `/transactions/${id}`, data: payload })
}

/**
 * Delete a transaction.
 */
export async function deleteTransaction(id: string): Promise<void> {
    return request({ method: 'DELETE', url: `/transactions/${id}` })
}
