import { z } from 'zod'

import { email, password, nameField } from '@/shared/lib/validation'

export const registerFormSchema = z
    .object({
        email,
        password,
        confirmPassword: z.string().min(1, 'Повторите пароль'),
        firstName: nameField,
        lastName: nameField
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Пароли не совпадают',
        path: ['confirmPassword']
    })
