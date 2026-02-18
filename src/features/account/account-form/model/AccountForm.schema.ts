import { z } from 'zod'

import { nameField } from '@/shared/lib/validation/primitives'

const accountTypeEnum = z.enum(['cash', 'bank', 'credit', 'saving'])

export const accountFormSchema = z.object({
    name: nameField,
    type: accountTypeEnum
})
