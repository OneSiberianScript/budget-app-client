import { describe, it, expect } from 'vitest'

import { email, nonEmptyString, password, nameField, positiveInt, optionalTrimmedString } from './primitives'

describe('primitives', () => {
    describe('email', () => {
        it('принимает валидный email', () => {
            expect(email.safeParse('user@example.com').success).toBe(true)
        })
        it('отклоняет невалидный email', () => {
            expect(email.safeParse('not-an-email').success).toBe(false)
            expect(email.safeParse('').success).toBe(false)
        })
    })

    describe('nonEmptyString', () => {
        it('принимает непустую строку', () => {
            expect(nonEmptyString.safeParse('a').success).toBe(true)
        })
        it('отклоняет пустую строку', () => {
            expect(nonEmptyString.safeParse('').success).toBe(false)
        })
    })

    describe('password', () => {
        it('принимает пароль от 8 символов', () => {
            expect(password.safeParse('12345678').success).toBe(true)
        })
        it('отклоняет короткий пароль', () => {
            expect(password.safeParse('1234567').success).toBe(false)
        })
    })

    describe('nameField', () => {
        it('принимает строку 2–50 символов', () => {
            expect(nameField.safeParse('Ab').success).toBe(true)
            expect(nameField.safeParse('A'.repeat(50)).success).toBe(true)
        })
        it('отклоняет слишком короткую или длинную', () => {
            expect(nameField.safeParse('A').success).toBe(false)
            expect(nameField.safeParse('A'.repeat(51)).success).toBe(false)
        })
    })

    describe('positiveInt', () => {
        it('принимает положительное целое', () => {
            expect(positiveInt.safeParse(1).success).toBe(true)
            expect(positiveInt.safeParse('42').success).toBe(true)
        })
        it('отклоняет ноль и отрицательные', () => {
            expect(positiveInt.safeParse(0).success).toBe(false)
            expect(positiveInt.safeParse(-1).success).toBe(false)
        })
    })

    describe('optionalTrimmedString', () => {
        it('принимает пустую строку', () => {
            const r = optionalTrimmedString.safeParse('')
            expect(r.success).toBe(true)
        })
        it('возвращает trim для непустой строки', () => {
            const r = optionalTrimmedString.safeParse('  a  ')
            expect(r.success).toBe(true)
            if (r.success) expect(r.data).toBe('a')
        })
    })
})
