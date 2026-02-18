import { transactionFormSchema } from './TransactionForm.schema'

import type { z } from 'zod'

export type TransactionFormValues = z.infer<typeof transactionFormSchema>

export const transactionFormInitialValues: TransactionFormValues = {
    type: 'expense',
    accountId: '',
    categoryId: '',
    amount: 0,
    occurredAt: ''
}
