import { z } from 'zod'
import { email, password } from '@/shared/lib/validation'

export const loginFormSchema = z.object({
    email,
    password
})
