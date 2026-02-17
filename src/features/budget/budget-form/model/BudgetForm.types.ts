import { budgetFormSchema } from './BudgetForm.schema'

import type { z } from 'zod'

export type BudgetFormValues = z.infer<typeof budgetFormSchema>

export const budgetFormInitialValues: BudgetFormValues = {
    name: ''
}
