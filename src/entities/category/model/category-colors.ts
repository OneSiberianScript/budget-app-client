/**
 * Опция выбора цвета категории для TheSelect (value — hex, label — название).
 */
export interface CategoryColorOption {
    label: string
    value: string
}

/**
 * Палитра из 20 цветов в стилистике приложения: accent, нейтральные, semantic и приглушённые оттенки для тегов категорий.
 */
export const CATEGORY_COLOR_OPTIONS: CategoryColorOption[] = [
    { label: 'Жёлтый', value: '#f5b72b' },
    { label: 'Золотой', value: '#b98516' },
    { label: 'Коралловый', value: '#e07a6a' },
    { label: 'Красный', value: '#d64545' },
    { label: 'Розовый', value: '#d4729a' },
    { label: 'Оранжевый', value: '#e6a23c' },
    { label: 'Бежевый', value: '#c4a77d' },
    { label: 'Зелёный', value: '#4caf6d' },
    { label: 'Морской', value: '#5a9b7a' },
    { label: 'Бирюзовый', value: '#4db6ac' },
    { label: 'Синий', value: '#3a7afe' },
    { label: 'Голубой', value: '#64b5f6' },
    { label: 'Фиолетовый', value: '#7e57c2' },
    { label: 'Сливовый', value: '#8e6c88' },
    { label: 'Серый', value: '#5f5c58' },
    { label: 'Тёмно-серый', value: '#312f2c' },
    { label: 'Графит', value: '#546e7a' },
    { label: 'Песочный', value: '#bebab5' },
    { label: 'Светло-жёлтый', value: '#feefc3' },
    { label: 'Мятный', value: '#a7d7c5' }
]
