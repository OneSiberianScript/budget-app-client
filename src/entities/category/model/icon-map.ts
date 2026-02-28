import {
    Airplane24Regular,
    AnimalCat24Regular,
    AnimalDog24Regular,
    Apps24Regular,
    Backpack24Regular,
    Balloon24Regular,
    Beach24Regular,
    Book24Regular,
    Briefcase24Regular,
    BriefcaseMedical24Regular,
    Broom24Regular,
    Building24Regular,
    BuildingBank24Regular,
    BuildingHome24Regular,
    Camera24Regular,
    Cart24Regular,
    CreditCardPerson24Regular,
    DrinkCoffee24Regular,
    DrinkWine24Regular,
    Flag24Regular,
    Food24Regular,
    FoodApple24Regular,
    FoodPizza24Regular,
    Games24Regular,
    Gas24Regular,
    Gift24Regular,
    Headphones24Regular,
    Heart24Regular,
    HeartPulse24Regular,
    Home24Regular,
    List24Regular,
    Money24Regular,
    MusicNote124Regular,
    PeopleTeam24Regular,
    PersonMoney24Regular,
    Phone24Regular,
    Pill24Regular,
    Receipt24Regular,
    ShoppingBag24Regular,
    Sport24Regular,
    Star24Regular,
    Table24Regular,
    Tag24Regular,
    Tent24Regular,
    Toolbox24Regular,
    VehicleBus24Regular,
    VehicleCar24Regular,
    Video24Regular,
    Wallet24Regular,
    Wrench24Regular
} from '@vicons/fluent'

import type { Component } from 'vue'

/** Маппинг строкового имени иконки (из API категории) в компонент @vicons/fluent. */
const CATEGORY_ICON_MAP: Record<string, Component> = {
    // Новые иконки
    airplane: Airplane24Regular,
    animalcat: AnimalCat24Regular,
    animaldog: AnimalDog24Regular,
    backpack: Backpack24Regular,
    balloon: Balloon24Regular,
    broom: Broom24Regular,
    creditcardperson: CreditCardPerson24Regular,
    drinkwine: DrinkWine24Regular,
    foodapple: FoodApple24Regular,
    foodpizza: FoodPizza24Regular,
    games: Games24Regular,
    heartpulse: HeartPulse24Regular,
    music: MusicNote124Regular,
    peopleteam: PeopleTeam24Regular,
    pill: Pill24Regular,
    toolbox: Toolbox24Regular,
    vehiclebus: VehicleBus24Regular,
    wrench: Wrench24Regular,
    // Существующие иконки (обратная совместимость)
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
 * Список из 36 иконок для выбора в форме категории: транспорт, путешествия,
 * люди, жильё, животные, здоровье, еда, учёба, развлечения, финансы.
 */
export const CATEGORY_ICON_OPTIONS: CategoryIconOption[] = [
    // Транспорт и путешествия
    { label: 'Машина', value: 'car' },
    { label: 'Транспорт', value: 'vehiclebus' },
    { label: 'Бензин', value: 'gas' },
    { label: 'Авиа', value: 'airplane' },
    { label: 'Отдых', value: 'beach' },
    // Люди
    { label: 'Ребёнок', value: 'games' },
    { label: 'Семья', value: 'peopleteam' },
    // Жильё
    { label: 'Дом', value: 'home' },
    { label: 'Хозтовары', value: 'toolbox' },
    { label: 'Ремонт', value: 'wrench' },
    { label: 'Уборка', value: 'broom' },
    // Животные
    { label: 'Кошка', value: 'animalcat' },
    { label: 'Собака', value: 'animaldog' },
    // Здоровье и спорт
    { label: 'Здоровье', value: 'heartpulse' },
    { label: 'Лекарства', value: 'pill' },
    { label: 'Спорт', value: 'sport' },
    // Еда и напитки
    { label: 'Покупки', value: 'shoppingbag' },
    { label: 'Продукты', value: 'foodapple' },
    { label: 'Ресторан', value: 'foodpizza' },
    { label: 'Бар', value: 'drinkwine' },
    // Учёба и работа
    { label: 'Работа', value: 'briefcase' },
    { label: 'Учёба', value: 'backpack' },
    { label: 'Книги', value: 'book' },
    // Развлечения
    { label: 'Развлечения', value: 'headphones' },
    { label: 'Кино', value: 'video' },
    { label: 'Музыка', value: 'music' },
    { label: 'Праздники', value: 'balloon' },
    { label: 'Подарки', value: 'gift' },
    { label: 'Цели', value: 'star' },
    // Финансы
    { label: 'Банк', value: 'buildingbank' },
    { label: 'Кредиты', value: 'creditcardperson' },
    { label: 'Кошелёк', value: 'wallet' },
    { label: 'Деньги', value: 'money' },
    { label: 'Зарплата', value: 'personmoney' },
    { label: 'Чек', value: 'receipt' },
    { label: 'Связь', value: 'phone' }
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
