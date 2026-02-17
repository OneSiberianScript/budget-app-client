/** Роль пользователя в бюджете. Используется сущностями budget и budget-member. */
export type BudgetRole = 'viewer' | 'editor' | 'owner'

/** Опции ролей для селекта (label/value). */
export const BUDGET_ROLE_OPTIONS: { label: string; value: BudgetRole }[] = [
    { label: 'Наблюдатель', value: 'viewer' },
    { label: 'Редактор', value: 'editor' },
    { label: 'Владелец', value: 'owner' }
]
