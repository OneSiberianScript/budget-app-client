import { z } from 'zod'

import { nameField } from '@/shared/lib/validation/primitives'

const categoryType = z.enum(['income', 'expense', 'transfer', 'saving'], { message: 'Выберите тип' })

export const categoryFormSchema = z.object({
    name: nameField,
    type: categoryType,
    parentId: z.string().nullable().optional()
})
