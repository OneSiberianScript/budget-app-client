import { z } from 'zod'

import { uuid } from '@/shared/lib/validation/primitives'

const transactionType = z.enum(['expense', 'income', 'transfer'])
const amount = z.coerce.number().refine((v) => v !== 0, 'Укажите сумму')
const occurredAt = z.string().min(1, 'Укажите дату')

export const transactionFormSchema = z.object({
    type: transactionType,
    accountId: uuid,
    categoryId: uuid,
    amount,
    occurredAt
})
