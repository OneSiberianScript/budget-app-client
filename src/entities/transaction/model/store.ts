import { defineStore } from 'pinia'
import { ref } from 'vue'

import * as transactionApi from '../api'

import type { Transaction } from './types'

export const useTransactionStore = defineStore('transaction', () => {
    const transactions = ref<Transaction[]>([])

    function setTransactions(list: Transaction[]) {
        transactions.value = Array.isArray(list)
            ? list.filter((item): item is Transaction => item != null && typeof item === 'object' && 'id' in item)
            : []
    }

    function setTransaction(transaction: Transaction) {
        const index = transactions.value.findIndex((t) => t.id === transaction.id)
        if (index >= 0) {
            transactions.value[index] = transaction
        } else {
            transactions.value.push(transaction)
        }
    }

    function removeTransaction(id: string) {
        transactions.value = transactions.value.filter((t) => t.id !== id)
    }

    async function fetchTransactions(
        budgetId: string,
        params?: Parameters<typeof transactionApi.fetchTransactions>[1]
    ) {
        const raw = await transactionApi.fetchTransactions(budgetId, params)
        const list = Array.isArray(raw)
            ? raw.filter((item): item is Transaction => item != null && typeof item === 'object' && 'id' in item)
            : []
        setTransactions(list)
        return list
    }

    return {
        transactions,
        setTransactions,
        setTransaction,
        removeTransaction,
        fetchTransactions
    }
})
