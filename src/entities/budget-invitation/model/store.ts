import { defineStore } from 'pinia'
import { ref } from 'vue'

import * as budgetInvitationApi from '../api'

import type { BudgetInvitation } from './types'

type CreatePayload = { budgetId: string; email: string; role: BudgetInvitation['role'] }

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

    /**
     * Создаёт приглашение в бюджет (owner). Добавляет запись в локальный список.
     * @param payload - budgetId, email, role
     */
    async function createInvitation(payload: CreatePayload) {
        const created = await budgetInvitationApi.createBudgetInvitation(payload)
        invitations.value = [...invitations.value, created]
        return created
    }

    /**
     * Отменяет приглашение по id. Удаляет запись из локального списка.
     * @param id - id приглашения
     */
    async function revokeInvitation(id: string) {
        await budgetInvitationApi.revokeBudgetInvitation(id)
        removeInvitation(id)
    }

    return {
        invitations,
        setInvitations,
        removeInvitation,
        fetchBudgetInvitations,
        createInvitation,
        revokeInvitation
    }
})
