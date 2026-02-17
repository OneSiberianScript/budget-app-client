import { z } from 'zod'
import { email, password, nameField } from '@/shared/lib/validation'

export const registerFormSchema = z.object({
    email,
    password,
    firstName: nameField,
    lastName: nameField
})
