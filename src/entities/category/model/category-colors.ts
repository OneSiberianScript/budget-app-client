/**
 * Опция выбора цвета категории для TheSelect (value — hex, label — название).
 */
export interface CategoryColorOption {
    label: string
    value: string
}

/**
 * Палитра из 36 цветов, отсортированных по тону (HSL hue, 0→360).
 * Нейтральные оттенки (S≈0%) — в конце. Исключены фоновые оттенки темы
 * и акцентный цвет (#f5b72b). Все цвета различимы на светлом и тёмном фоне.
 */
export const CATEGORY_COLOR_OPTIONS: CategoryColorOption[] = [
    // H ≈ 0–10° (красный — коралловый)
    { label: 'Красный', value: '#d64545' },
    { label: 'Алый', value: '#c0392b' },
    { label: 'Коралловый', value: '#e07a6a' },
    // H ≈ 18–41° (оранжевый — золотой)
    { label: 'Кирпичный', value: '#cc5520' },
    { label: 'Коричневый', value: '#7d5a3c' },
    { label: 'Терракота', value: '#a07850' },
    { label: 'Бежевый', value: '#c4a77d' },
    { label: 'Оранжевый', value: '#e6a23c' },
    { label: 'Золотой', value: '#b98516' },
    // H ≈ 55–95° (жёлто-зелёный)
    { label: 'Горчичный', value: '#a89c1e' },
    { label: 'Оливковый', value: '#7a9c2e' },
    { label: 'Лаймовый', value: '#5ea030' },
    // H ≈ 140–175° (зелёный — тёмно-мятный — бирюзовый)
    { label: 'Зелёный', value: '#4caf6d' },
    { label: 'Изумрудный', value: '#29a35a' },
    { label: 'Морской', value: '#5a9b7a' },
    { label: 'Мятный', value: '#a7d7c5' },
    { label: 'Тёмно-мятный', value: '#2d9e7a' },
    { label: 'Бирюзовый', value: '#4db6ac' },
    // H ≈ 190–221° (синий — голубой — графит)
    { label: 'Циан', value: '#0d8ea8' },
    { label: 'Синезелёный', value: '#2e7b98' },
    { label: 'Графит', value: '#546e7a' },
    { label: 'Голубой', value: '#64b5f6' },
    { label: 'Стальной', value: '#7a8898' },
    { label: 'Тёмно-серый', value: '#4a5568' },
    { label: 'Тёмно-синий', value: '#1a56c4' },
    { label: 'Синий', value: '#3a7afe' },
    { label: 'Перивинкль', value: '#6b7ea8' },
    // H ≈ 246–311° (индиго — фиолетовый — сливовый)
    { label: 'Индиго', value: '#4338a8' },
    { label: 'Фиолетовый', value: '#7e57c2' },
    { label: 'Пурпурный', value: '#9c4fb5' },
    { label: 'Сливовый', value: '#8e6c88' },
    // H ≈ 328–344° (фуксия — малиновый)
    { label: 'Фуксия', value: '#c24a8a' },
    { label: 'Розовый', value: '#d4729a' },
    { label: 'Малиновый', value: '#c0395e' },
    // Нейтральные (S ≈ 0%)
    { label: 'Серый', value: '#5f5c58' },
    { label: 'Светло-серый', value: '#9e9e9e' }
]
