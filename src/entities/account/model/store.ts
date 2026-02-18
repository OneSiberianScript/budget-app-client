import { defineStore } from 'pinia'
import { ref } from 'vue'

import * as accountApi from '../api'

import type { Account } from './types'

export const useAccountStore = defineStore('account', () => {
    const accounts = ref<Account[]>([])

    function setAccounts(list: Account[]) {
        accounts.value = Array.isArray(list)
            ? list.filter((item): item is Account => item != null && typeof item === 'object' && 'id' in item)
            : []
    }

    function setAccount(account: Account) {
        const index = accounts.value.findIndex((a) => a.id === account.id)
        if (index >= 0) {
            accounts.value[index] = account
        } else {
            accounts.value.push(account)
        }
    }

    function removeAccount(id: string) {
        accounts.value = accounts.value.filter((a) => a.id !== id)
    }

    async function fetchAccounts(budgetId: string) {
        const raw = await accountApi.fetchAccounts(budgetId)
        const list = Array.isArray(raw)
            ? raw.filter((item): item is Account => item != null && typeof item === 'object' && 'id' in item)
            : []
        setAccounts(list)
        return list
    }

    return {
        accounts,
        setAccounts,
        setAccount,
        removeAccount,
        fetchAccounts
    }
})
