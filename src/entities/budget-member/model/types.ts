import type { BudgetRole } from '@/shared/lib/budget-role'

export interface BudgetMember {
    id: string
    budgetId: string
    userId: string
    role: BudgetRole
    email?: string
    firstName?: string
    lastName?: string
    createdAt: string
    updatedAt: string
}
