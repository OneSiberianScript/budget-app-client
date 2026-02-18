import { categoryFormSchema } from './CategoryForm.schema'

import type { z } from 'zod'

export type CategoryFormValues = z.infer<typeof categoryFormSchema>

export const categoryFormInitialValues: CategoryFormValues = {
    name: '',
    type: 'expense',
    parentId: null
}
