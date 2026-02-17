import type { BudgetRole } from '@/shared/lib/budget-role'

export interface BudgetInvitation {
    id: string
    budgetId: string
    email: string
    role: BudgetRole
    token?: string
    status: 'pending' | 'accepted' | 'expired'
    createdAt: string
    updatedAt: string
}
