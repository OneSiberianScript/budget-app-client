import {
    DataPie24Regular,
    Payment24Regular,
    Receipt24Regular,
    Tag24Regular,
    Target24Regular,
    Wallet24Regular
} from '@vicons/fluent'

import { ROUTE_NAMES } from '@/shared/config/router'

import type { Component } from 'vue'

export interface NavItem {
    name: string
    label: string
    icon: Component
}

/** Конфиг пунктов главной навигации приложения (порядок: дашборд → бюджеты → счета → категории → планы → транзакции). */
export const APP_NAV_ITEMS: NavItem[] = [
    { name: ROUTE_NAMES.HOME, label: 'Дашборд', icon: DataPie24Regular },
    { name: ROUTE_NAMES.BUDGETS, label: 'Бюджеты', icon: Wallet24Regular },
    { name: ROUTE_NAMES.ACCOUNTS, label: 'Счета', icon: Payment24Regular },
    { name: ROUTE_NAMES.CATEGORIES, label: 'Категории', icon: Tag24Regular },
    { name: ROUTE_NAMES.BUDGET_PLANS, label: 'Планы', icon: Target24Regular },
    { name: ROUTE_NAMES.TRANSACTIONS, label: 'Транзакции', icon: Receipt24Regular }
]
