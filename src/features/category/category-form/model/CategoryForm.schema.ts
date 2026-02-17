import { z } from 'zod'

import { nameField } from '@/shared/lib/validation/primitives'

const categoryType = z.enum(['income', 'expense'], { message: 'Выберите тип' })

export const categoryFormSchema = z.object({
    name: nameField,
    type: categoryType
})
