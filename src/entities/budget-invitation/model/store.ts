import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { BudgetInvitationRole } from '@/shared/types'

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

    function updateInvitationInList(updated: BudgetInvitation) {
        const idx = invitations.value.findIndex((i) => i.id === updated.id)
        if (idx >= 0) invitations.value[idx] = updated
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
     * Изменяет роль в pending-приглашении (owner). Обновляет запись в локальном списке.
     * @param id - id приглашения
     * @param role - новая роль
     */
    async function updateInvitationRole(id: string, role: BudgetInvitationRole) {
        const updated = await budgetInvitationApi.updateInvitationRole(id, role)
        updateInvitationInList(updated)
        return updated
    }

    /**
     * Отменяет приглашение по id. Удаляет запись из локального списка.
     * @param id - id приглашения
     */
    async function revokeInvitation(id: string) {
        await budgetInvitationApi.revokeBudgetInvitation(id)
        removeInvitation(id)
    }

    /**
     * Принимает приглашение (вызывает сам приглашённый по токену из письма).
     * @param id - id приглашения (токен из URL)
     */
    async function acceptInvitation(id: string) {
        return budgetInvitationApi.acceptInvitation(id)
    }

    /**
     * Отклоняет приглашение (вызывает сам приглашённый).
     * @param id - id приглашения (токен из URL)
     */
    async function rejectInvitation(id: string) {
        return budgetInvitationApi.rejectInvitation(id)
    }

    return {
        invitations,
        setInvitations,
        removeInvitation,
        fetchBudgetInvitations,
        createInvitation,
        updateInvitationRole,
        revokeInvitation,
        acceptInvitation,
        rejectInvitation
    }
})
