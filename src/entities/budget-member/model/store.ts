import { defineStore } from 'pinia'
import { ref } from 'vue'

import * as budgetMemberApi from '../api'

import type { BudgetMember } from './types'

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

    function removeMember(id: string) {
        members.value = members.value.filter((m) => m.id !== id)
    }

    async function fetchBudgetMembers(budgetId: string) {
        const list = await budgetMemberApi.fetchBudgetMembers(budgetId)
        setMembers(list)
        return list
    }

    return {
        members,
        setMembers,
        setMember,
        removeMember,
        fetchBudgetMembers
    }
})
