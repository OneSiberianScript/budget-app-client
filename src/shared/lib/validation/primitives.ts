import { z } from 'zod'

/** Строка без пробелов по краям, минимум 1 символ. */
export const nonEmptyString = z.string().min(1, 'Обязательное поле').trim()

/** Email: обязательное поле, валидный формат. */
export const email = z.string().min(1, 'Введите email').email('Некорректный email').trim().toLowerCase()

/** Пароль: минимум 8 символов. */
export const password = z.string().min(1, 'Введите пароль').min(8, 'Минимум 8 символов')

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
/** UUID v4. */
export const uuid = z.string().regex(uuidRegex, 'Некорректный идентификатор')

/** Телефон в формате E.164 (пустая строка допускается). */
export const phoneE164 = z
    .string()
    .transform((v) => v.trim())
    .refine((v) => v === '' || /^\+[1-9]\d{1,14}$/.test(v), 'Телефон в формате +79991234567')

/** Опциональная строка с trim. */
export const optionalTrimmedString = z
    .string()
    .transform((v) => v.trim())
    .optional()

/** Строка с trim; пустая превращается в null. */
export const nullableTrimmedString = z
    .string()
    .transform((v) => (v.trim() === '' ? null : v.trim()))
    .nullable()

/** Положительное целое (coerce). */
export const positiveInt = z.coerce.number().int().positive('Должно быть положительное число')

/** Поле «имя»: 2–50 символов. */
export const nameField = nonEmptyString.min(2, 'Минимум 2 символа').max(50, 'Максимум 50 символов')
