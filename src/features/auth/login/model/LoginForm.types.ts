import { loginFormSchema } from './LoginForm.schema'

import type { z } from 'zod'

export type LoginFormValues = z.infer<typeof loginFormSchema>

export const loginFormInitialValues: LoginFormValues = {
    email: '',
    password: ''
}
