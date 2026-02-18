import type { BudgetMemberRole } from '@/shared/types'

/** Роль пользователя в бюджете. Совпадает с BudgetMemberRole из API. */
export type BudgetRole = BudgetMemberRole

/** Опции ролей для селекта (label/value). */
export const BUDGET_ROLE_OPTIONS: { label: string; value: BudgetRole }[] = [
    { label: 'Наблюдатель', value: 'viewer' },
    { label: 'Редактор', value: 'editor' },
    { label: 'Владелец', value: 'owner' }
]
