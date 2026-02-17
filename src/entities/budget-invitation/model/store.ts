import { defineStore } from 'pinia'
import { ref } from 'vue'

import * as budgetInvitationApi from '../api'

import type { BudgetInvitation } from './types'

export const useBudgetInvitationStore = defineStore('budgetInvitation', () => {
    const invitations = ref<BudgetInvitation[]>([])

    function setInvitations(list: BudgetInvitation[]) {
        invitations.value = list
    }

    function removeInvitation(id: string) {
        invitations.value = invitations.value.filter((i) => i.id !== id)
    }

    async function fetchBudgetInvitations(budgetId: string) {
        const list = await budgetInvitationApi.fetchBudgetInvitations(budgetId)
        setInvitations(list)
        return list
    }

    return {
        invitations,
        setInvitations,
        removeInvitation,
        fetchBudgetInvitations
    }
})
