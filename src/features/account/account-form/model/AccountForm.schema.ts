import { z } from 'zod'

import { nameField } from '@/shared/lib/validation/primitives'

const accountTypeEnum = z.enum(['account', 'card', 'cash'])

export const accountFormSchema = z.object({
    name: nameField,
    type: accountTypeEnum,
    initialBalance: z.string().optional(),
    bank: z.string().nullable().optional()
})
