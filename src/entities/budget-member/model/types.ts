import type { BudgetMember as ApiBudgetMember } from '@/shared/types'

export type { BudgetMemberRole } from '@/shared/types'
export type BudgetMember = ApiBudgetMember

/** Участник с подставленными данными пользователя (для отображения в UI). */
export type BudgetMemberWithUser = BudgetMember & {
    email?: string
    firstName?: string
    lastName?: string
}
