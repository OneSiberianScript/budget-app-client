import { z } from 'zod'

import { email } from '@/shared/lib/validation/primitives'

const budgetRole = z.enum(['viewer', 'editor', 'owner'], {
    errorMap: () => ({ message: 'Выберите роль' })
})

/** Zod-схема формы приглашения в бюджет (email + роль). */
export const inviteFormSchema = z.object({
    email,
    role: budgetRole
})
