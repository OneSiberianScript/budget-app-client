import { planItemFormSchema } from './PlanItemForm.schema'

import type { z } from 'zod'

export type PlanItemFormValues = z.infer<typeof planItemFormSchema>

export const planItemFormInitialValues: PlanItemFormValues = {
    categoryId: '',
    limitRub: 0
}
