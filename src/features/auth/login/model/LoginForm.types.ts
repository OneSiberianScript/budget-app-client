import type { z } from 'zod'
import { loginFormSchema } from './LoginForm.schema'

export type LoginFormValues = z.infer<typeof loginFormSchema>

export const loginFormInitialValues: LoginFormValues = {
    email: '',
    password: ''
}
