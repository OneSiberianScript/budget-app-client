import type { z } from 'zod'
import { registerFormSchema } from './RegisterForm.schema'

export type RegisterFormValues = z.infer<typeof registerFormSchema>

export const registerFormInitialValues: RegisterFormValues = {
    email: '',
    password: '',
    firstName: '',
    lastName: ''
}
