/**
 * Логотипы банков и маппинг названия банка (account.bank) на URL логотипа.
 */

const logoModules = import.meta.glob('../assets/bank-logos/*.svg', {
    eager: true,
    as: 'url'
}) as Record<string, string>

const logoUrls: Record<string, string> = {}
for (const path of Object.keys(logoModules)) {
    const name = path.replace(/^.*\/([^/]+)\.svg$/, '$1')
    logoUrls[name] = logoModules[path] ?? ''
}

/** Отображаемые названия банков для UI (ключ файла логотипа → подпись) */
const BANK_DISPLAY_NAMES: Record<string, string> = {
    sberbank: 'Сбербанк',
    tbank: 'Т‑Банк',
    alfabank: 'Альфа-Банк',
    gpbank: 'ГПБ',
    ozonbank: 'Озон Банк',
    sbp: 'СБП'
}

/** Алиасы: нормализованная строка (lowercase, без пробелов/дефисов) → ключ файла логотипа */
const BANK_ALIASES: Record<string, string> = {
    sberbank: 'sberbank',
    сбербанк: 'sberbank',
    tbank: 'tbank',
    тбанк: 'tbank',
    тинькофф: 'tbank',
    тинькоффбанк: 'tbank',
    alfabank: 'alfabank',
    альфабанк: 'alfabank',
    'альфа-банк': 'alfabank',
    gpbank: 'gpbank',
    гпб: 'gpbank',
    гпбанк: 'gpbank',
    ozonbank: 'ozonbank',
    озонбанк: 'ozonbank',
    sbp: 'sbp',
    сбп: 'sbp',
    системабыстрыхплатежей: 'sbp'
}

function normalizeBankKey(bank: string): string {
    return bank
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, '')
}

/**
 * Возвращает URL логотипа банка для значения account.bank, или null, если логотипа нет.
 * Поддерживаются латинские ключи (sberbank, tbank, …) и русские названия через словарь алиасов.
 *
 * @param bank — значение поля bank у счёта (название или ключ банка)
 * @returns URL SVG-логотипа или null
 */
export function getBankLogoUrl(bank: string | null): string | null {
    if (!bank || typeof bank !== 'string') return null
    const key = normalizeBankKey(bank)
    const logoKey = BANK_ALIASES[key] ?? key
    const url = logoUrls[logoKey]
    return url || null
}

export interface BankSelectOption {
    value: string | null
    label: string
    logoUrl: string | null
}

/**
 * Опции для селекта банка в форме счёта: «Не указан» + банки с логотипами.
 *
 * @returns Массив опций { value, label, logoUrl } для TheSelect
 */
export function getBankSelectOptions(): BankSelectOption[] {
    const empty: BankSelectOption = { value: null, label: 'Не указан', logoUrl: null }
    const bankOptions: BankSelectOption[] = [empty]
    for (const key of Object.keys(BANK_DISPLAY_NAMES)) {
        const url = logoUrls[key] ?? null
        if (url) {
            bankOptions.push({ value: key, label: BANK_DISPLAY_NAMES[key], logoUrl: url })
        }
    }
    return bankOptions
}
