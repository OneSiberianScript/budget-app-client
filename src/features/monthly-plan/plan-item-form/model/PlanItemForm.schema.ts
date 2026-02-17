import { z } from 'zod'

import { uuid } from '@/shared/lib/validation/primitives'

/** Лимит в рублях (в форме); при отправке переводится в копейки */
const limitRub = z.coerce.number().min(0, 'Лимит не может быть отрицательным')

export const planItemFormSchema = z.object({
    categoryId: uuid,
    limitRub
})
