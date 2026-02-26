import { registerFormSchema } from './RegisterForm.schema'

import type { z } from 'zod'

export type RegisterFormValues = z.infer<typeof registerFormSchema>

export const registerFormInitialValues: RegisterFormValues = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
}
