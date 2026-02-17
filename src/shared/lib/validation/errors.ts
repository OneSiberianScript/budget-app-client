import type { ZodError } from 'zod'

/**
 * Converts ZodError to a record of field names → error messages for VeeValidate setFieldError / Form errors.
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
