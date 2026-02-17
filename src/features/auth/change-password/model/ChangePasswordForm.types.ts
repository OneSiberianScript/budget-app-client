import { changePasswordFormSchema } from './ChangePasswordForm.schema'

import type { z } from 'zod'

export type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>

export const changePasswordFormInitialValues: ChangePasswordFormValues = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
}
