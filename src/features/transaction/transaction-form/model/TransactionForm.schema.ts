import { z } from 'zod'

const transactionType = z.enum(['expense', 'income', 'transfer'])
const amount = z.coerce.number().refine((v) => v !== 0, 'Укажите сумму')
const occurredAt = z.string().min(1, 'Укажите дату')
const optionalUuid = z.union([z.string().uuid(), z.literal('')]).optional()

export const transactionFormSchema = z
    .object({
        type: transactionType,
        debitAccountId: optionalUuid,
        creditAccountId: optionalUuid,
        categoryId: optionalUuid,
        amount,
        occurredAt,
        description: z.string().optional()
    })
    .refine(
        (data) => {
            if (data.type === 'expense') return !!data.debitAccountId
            if (data.type === 'income') return !!data.creditAccountId
            if (data.type === 'transfer') return !!data.debitAccountId && !!data.creditAccountId
            return true
        },
        { message: 'Укажите счёт(а) по типу транзакции', path: ['debitAccountId'] }
    )
