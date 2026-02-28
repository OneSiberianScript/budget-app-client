import { defineStore } from 'pinia'
import { ref } from 'vue'

import * as budgetMemberApi from '../api'

import type { BudgetMember, BudgetMemberRole } from './types'

export const useBudgetMemberStore = defineStore('budgetMember', () => {
    const members = ref<BudgetMember[]>([])

    function setMembers(list: BudgetMember[]) {
        members.value = list
    }

    function setMember(member: BudgetMember) {
        const index = members.value.findIndex((m) => m.id === member.id)
        if (index >= 0) {
            members.value[index] = member
        } else {
            members.value.push(member)
        }
    }

    function removeMemberFromList(id: string) {
        members.value = members.value.filter((m) => m.id !== id)
    }

    async function fetchBudgetMembers(budgetId: string) {
        const list = await budgetMemberApi.fetchBudgetMembers(budgetId)
        setMembers(list)
        return list
    }

    /**
     * Изменяет роль участника бюджета (только owner). Обновляет запись в локальном списке.
     * @param id - id участника
     * @param role - новая роль
     */
    async function updateMember(id: string, role: BudgetMemberRole) {
        const updated = await budgetMemberApi.updateBudgetMember(id, { role })
        setMember(updated)
        return updated
    }

    /**
     * Удаляет участника из бюджета (только owner). Убирает запись из локального списка.
     * @param id - id участника
     */
    async function removeMember(id: string) {
        await budgetMemberApi.removeBudgetMember(id)
        removeMemberFromList(id)
    }

    return {
        members,
        setMembers,
        setMember,
        removeMemberFromList,
        fetchBudgetMembers,
        updateMember,
        removeMember
    }
})
