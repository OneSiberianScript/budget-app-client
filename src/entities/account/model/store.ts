import { defineStore } from 'pinia'
import { ref } from 'vue'

import * as accountApi from '../api'

import type { Account } from './types'

export const useAccountStore = defineStore('account', () => {
    const accounts = ref<Account[]>([])

    function setAccounts(list: Account[]) {
        accounts.value = list
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
        const list = await accountApi.fetchAccounts(budgetId)
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
