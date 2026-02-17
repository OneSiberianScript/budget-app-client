import { z } from 'zod'

export const nonEmptyString = z.string().min(1, 'Обязательное поле').trim()

export const email = z.string().min(1, 'Введите email').email('Некорректный email').trim().toLowerCase()

export const password = z
    .string()
    .min(1, 'Введите пароль')
    .min(8, 'Минимум 8 символов')

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
export const uuid = z.string().regex(uuidRegex, 'Некорректный идентификатор')

/** E.164 phone (optional empty) */
export const phoneE164 = z
    .string()
    .transform((v) => v.trim())
    .refine((v) => v === '' || /^\+[1-9]\d{1,14}$/.test(v), 'Телефон в формате +79991234567')

export const optionalTrimmedString = z.string().transform((v) => v.trim()).optional()

export const nullableTrimmedString = z
    .string()
    .transform((v) => (v.trim() === '' ? null : v.trim()))
    .nullable()

export const positiveInt = z.coerce.number().int().positive('Должно быть положительное число')

/** Name field (2–50 chars) */
export const nameField = nonEmptyString.min(2, 'Минимум 2 символа').max(50, 'Максимум 50 символов')
