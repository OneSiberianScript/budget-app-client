/**
 * Утилиты для работы с датами (текущий месяц, границы месяца для API).
 */

/**
 * Возвращает текущий месяц в формате YYYY-MM.
 * @returns Строка вида "2025-02"
 */
export function getCurrentMonth(): string {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

/**
 * Возвращает границы месяца для запросов API (первый и последний день в YYYY-MM-DD).
 * @param month — строка YYYY-MM
 * @returns Объект { from, to } с датами в формате YYYY-MM-DD
 */
function pad2(n: number): string {
    return String(n).padStart(2, '0')
}

export function getMonthRange(month: string): { from: string; to: string } {
    const [y, m] = month.split('-').map(Number)
    const from = new Date(y, m - 1, 1)
    const to = new Date(y, m, 0)
    return {
        from: `${from.getFullYear()}-${pad2(from.getMonth() + 1)}-${pad2(from.getDate())}`,
        to: `${to.getFullYear()}-${pad2(to.getMonth() + 1)}-${pad2(to.getDate())}`
    }
}
