/**
 * Форматирует сумму в копейках как валюту (рубли).
 * @param cents — сумма в копейках
 * @param currency — код валюты (по умолчанию RUB)
 */
export function formatMoneyFromCents(cents: number, currency = 'RUB'): string {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(cents / 100)
}

export interface FormatRublesOptions {
    /** Количество знаков после запятой (по умолчанию 2 для баланса, 0 для списков). */
    maxFractionDigits?: number
}

/**
 * Форматирует сумму в рублях по российской локали: пробелы между разрядами, запятая для копеек, символ ₽.
 * @param value — сумма в рублях (строка или число, например из API)
 * @param options — maxFractionDigits: по умолчанию 2 (баланс), для списков транзакций/лимитов передать 0
 */
export function formatRubles(value: string | number, options?: FormatRublesOptions): string {
    const num = typeof value === 'string' ? parseFloat(value) : value
    if (Number.isNaN(num)) return '—'
    const maxFractionDigits = options?.maxFractionDigits ?? 2
    const minFractionDigits = maxFractionDigits === 0 ? 0 : 2
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: minFractionDigits,
        maximumFractionDigits: maxFractionDigits
    }).format(num)
}
