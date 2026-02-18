import { z } from 'zod'

import { nameField } from '@/shared/lib/validation/primitives'

export const budgetFormSchema = z.object({
    name: nameField,
    currency: z.string().min(1, 'Укажите валюту'),
    initialBalance: z.string().optional()
})
