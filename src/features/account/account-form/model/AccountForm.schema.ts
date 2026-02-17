import { z } from 'zod'

import { nameField } from '@/shared/lib/validation/primitives'

const currency = z.string().min(1, 'Укажите валюту').trim().length(3, 'Код валюты 3 символа (например RUB)')

export const accountFormSchema = z.object({
    name: nameField,
    currency
})
