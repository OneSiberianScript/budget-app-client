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
