import { accountFormSchema } from './AccountForm.schema'

import type { z } from 'zod'

export type AccountFormValues = z.infer<typeof accountFormSchema>

export const accountFormInitialValues: AccountFormValues = {
    name: '',
    type: 'account',
    initialBalance: '',
    bank: null
}
