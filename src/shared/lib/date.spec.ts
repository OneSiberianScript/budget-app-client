import { describe, it, expect } from 'vitest'

import { getCurrentMonth, getMonthRange } from './date'

describe('date', () => {
    describe('getCurrentMonth', () => {
        it('возвращает строку формата YYYY-MM', () => {
            const result = getCurrentMonth()
            expect(result).toMatch(/^\d{4}-\d{2}$/)
            const [y, m] = result.split('-').map(Number)
            expect(y).toBeGreaterThanOrEqual(2000)
            expect(y).toBeLessThanOrEqual(2100)
            expect(m).toBeGreaterThanOrEqual(1)
            expect(m).toBeLessThanOrEqual(12)
        })
    })

    describe('getMonthRange', () => {
        it('возвращает from — первый день месяца, to — последний в YYYY-MM-DD', () => {
            const { from, to } = getMonthRange('2025-02')
            expect(from).toBe('2025-02-01')
            expect(to).toBe('2025-02-28')
        })

        it('корректно считает високосный февраль', () => {
            const { from, to } = getMonthRange('2024-02')
            expect(from).toBe('2024-02-01')
            expect(to).toBe('2024-02-29')
        })

        it('корректно считает декабрь', () => {
            const { from, to } = getMonthRange('2025-12')
            expect(from).toBe('2025-12-01')
            expect(to).toBe('2025-12-31')
        })
    })
})
