import { z } from 'zod'

import { nameField } from '@/shared/lib/validation/primitives'

export const budgetFormSchema = z.object({
    name: nameField
})
