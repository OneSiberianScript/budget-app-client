import { z } from 'zod'

import { password } from '@/shared/lib/validation'

export const changePasswordFormSchema = z
    .object({
        currentPassword: password,
        newPassword: password,
        confirmNewPassword: z.string().min(1, 'Повторите новый пароль')
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: 'Пароли не совпадают',
        path: ['confirmNewPassword']
    })
