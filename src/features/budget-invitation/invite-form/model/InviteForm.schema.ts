import { z } from 'zod'

import { email } from '@/shared/lib/validation/primitives'

/** Для приглашений доступны только редактор и наблюдатель (без владельца). */
const invitationRole = z.enum(['viewer', 'editor'], {
    errorMap: () => ({ message: 'Выберите роль' })
})

/** Zod-схема формы приглашения в бюджет (email + роль). */
export const inviteFormSchema = z.object({
    email,
    role: invitationRole
})
