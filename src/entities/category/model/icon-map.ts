import {
    Apps24Regular,
    Beach24Regular,
    Book24Regular,
    Briefcase24Regular,
    BriefcaseMedical24Regular,
    Building24Regular,
    BuildingBank24Regular,
    BuildingHome24Regular,
    Camera24Regular,
    Cart24Regular,
    DrinkCoffee24Regular,
    Flag24Regular,
    Food24Regular,
    Gas24Regular,
    Gift24Regular,
    Headphones24Regular,
    Heart24Regular,
    Home24Regular,
    List24Regular,
    Money24Regular,
    PersonMoney24Regular,
    Phone24Regular,
    Receipt24Regular,
    ShoppingBag24Regular,
    Sport24Regular,
    Star24Regular,
    Table24Regular,
    Tag24Regular,
    Tent24Regular,
    VehicleCar24Regular,
    Video24Regular,
    Wallet24Regular
} from '@vicons/fluent'

import type { Component } from 'vue'

/** Маппинг строкового имени иконки (из API категории) в компонент @vicons/fluent. */
const CATEGORY_ICON_MAP: Record<string, Component> = {
    apps: Apps24Regular,
    beach: Beach24Regular,
    book: Book24Regular,
    briefcase: Briefcase24Regular,
    briefcasemedical: BriefcaseMedical24Regular,
    building: Building24Regular,
    buildingbank: BuildingBank24Regular,
    buildinghome: BuildingHome24Regular,
    camera: Camera24Regular,
    cart: Cart24Regular,
    coffee: DrinkCoffee24Regular,
    drinkcoffee: DrinkCoffee24Regular,
    flag: Flag24Regular,
    food: Food24Regular,
    gas: Gas24Regular,
    gift: Gift24Regular,
    headphones: Headphones24Regular,
    heart: Heart24Regular,
    home: Home24Regular,
    list: List24Regular,
    money: Money24Regular,
    personmoney: PersonMoney24Regular,
    phone: Phone24Regular,
    receipt: Receipt24Regular,
    shoppingbag: ShoppingBag24Regular,
    sport: Sport24Regular,
    star: Star24Regular,
    table: Table24Regular,
    tag: Tag24Regular,
    tent: Tent24Regular,
    vehiclecar: VehicleCar24Regular,
    car: VehicleCar24Regular,
    video: Video24Regular,
    wallet: Wallet24Regular,
    bank: BuildingBank24Regular
}

/**
 * Опции выбора иконки категории для TheSelect (value — ключ для API, label — описание до 2 слов).
 */
export interface CategoryIconOption {
    label: string
    value: string
}

/**
 * Список из 30 иконок для выбора в форме категории: расходы, доходы, нейтральные.
 */
export const CATEGORY_ICON_OPTIONS: CategoryIconOption[] = [
    { label: 'Приложения', value: 'apps' },
    { label: 'Банк', value: 'bank' },
    { label: 'Дом', value: 'home' },
    { label: 'Список', value: 'list' },
    { label: 'Таблица', value: 'table' },
    { label: 'Кошелёк', value: 'wallet' },
    { label: 'Еда', value: 'food' },
    { label: 'Корзина', value: 'cart' },
    { label: 'Авто', value: 'car' },
    { label: 'Подарок', value: 'gift' },
    { label: 'Деньги', value: 'money' },
    { label: 'Чек', value: 'receipt' },
    { label: 'Здоровье', value: 'heart' },
    { label: 'Работа', value: 'briefcase' },
    { label: 'Связь', value: 'phone' },
    { label: 'Кофе', value: 'coffee' },
    { label: 'Бензин', value: 'gas' },
    { label: 'Метка', value: 'tag' },
    { label: 'Здание', value: 'building' },
    { label: 'Отдых', value: 'beach' },
    { label: 'Книги', value: 'book' },
    { label: 'Спорт', value: 'sport' },
    { label: 'Путешествия', value: 'tent' },
    { label: 'Цель', value: 'flag' },
    { label: 'Звезда', value: 'star' },
    { label: 'Зарплата', value: 'personmoney' },
    { label: 'Медицина', value: 'briefcasemedical' },
    { label: 'Покупки', value: 'shoppingbag' },
    { label: 'Недвижимость', value: 'buildinghome' },
    { label: 'Фото', value: 'camera' }
]

/**
 * Возвращает компонент иконки для категории по строковому имени.
 * При неизвестном или пустом имени возвращается иконка по умолчанию (Apps24Regular).
 *
 * @param icon — имя иконки из API (category.icon) или null
 * @returns компонент иконки для использования в template
 */
export function getCategoryIconComponent(icon: string | null): Component {
    if (!icon || typeof icon !== 'string') return Apps24Regular
    const key = icon.trim().toLowerCase().replace(/[- ]/g, '')
    return CATEGORY_ICON_MAP[key] ?? Apps24Regular
}
