import { describe, it, expect } from 'vitest'

import { formatMoneyFromCents, formatRubles } from './format-money'

/** Нормализует пробелы в выводе Intl (в т.ч. U+00A0) для сравнения в тестах. */
function norm(s: string): string {
    return s.replace(/\s/g, ' ')
}

describe('format-money', () => {
    describe('formatRubles', () => {
        it('форматирует число: пробелы между разрядами и символ ₽', () => {
            expect(norm(formatRubles(1_234_567))).toContain('1 234 567')
            expect(formatRubles(1_234_567)).toContain('₽')
        })

        it('принимает строку и парсит число', () => {
            expect(norm(formatRubles('1234.56'))).toContain('1 234')
            expect(formatRubles('1234.56')).toContain('₽')
        })

        it('по умолчанию два знака после запятой (баланс)', () => {
            const result = formatRubles(1234.5)
            expect(norm(result)).toContain('1 234')
            expect(result).toMatch(/,\d{2}\s*₽/)
        })

        it('maxFractionDigits: 0 — целые рубли (списки)', () => {
            const result = formatRubles(1234.56, { maxFractionDigits: 0 })
            expect(norm(result)).toContain('1 235') // округление
            expect(result).toContain('₽')
            expect(result).not.toContain(',')
        })

        it('возвращает «—» для NaN и невалидной строки', () => {
            expect(formatRubles(NaN)).toBe('—')
            expect(formatRubles('')).toBe('—')
            expect(formatRubles('abc')).toBe('—')
        })
    })

    describe('formatMoneyFromCents', () => {
        it('переводит копейки в рубли с пробелами и ₽', () => {
            const result = formatMoneyFromCents(123456) // 1234.56 руб
            expect(norm(result)).toContain('1 235') // округление до целых
            expect(result).toContain('₽')
        })

        it('целые рубли без копеек', () => {
            expect(formatMoneyFromCents(100_00)).toContain('100')
            expect(formatMoneyFromCents(100_00)).toContain('₽')
        })
    })
})
