import { z } from 'zod'

import { uuid } from '@/shared/lib/validation/primitives'

const amount = z.coerce.number().refine((v) => v !== 0, 'Укажите сумму')
const dateString = z.string().min(1, 'Укажите дату')
const optionalNote = z.string().trim().optional()

export const transactionFormSchema = z.object({
    accountId: uuid,
    categoryId: uuid,
    amount,
    date: dateString,
    note: optionalNote
})
