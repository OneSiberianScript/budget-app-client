import { inviteFormSchema } from './InviteForm.schema'

import type { z } from 'zod'

/** Тип значений формы приглашения в бюджет. */
export type InviteFormValues = z.infer<typeof inviteFormSchema>

/** Начальные значения формы приглашения. */
export const inviteFormInitialValues: InviteFormValues = {
    email: '',
    role: 'viewer'
}
