import type { ZodError } from 'zod'

/**
 * Преобразует ZodError в объект «имя поля → сообщение об ошибке» для setFieldError и отображения ошибок формы.
 * @param zodError - Ошибка валидации Zod
 * @returns Запись вида { fieldName: 'сообщение' }
 */
export function toFieldErrors(zodError: ZodError): Record<string, string> {
    const out: Record<string, string> = {}
    for (const e of zodError.errors) {
        const path = e.path.join('.')
        if (path && e.message) {
            out[path] = e.message
        }
    }
    return out
}
