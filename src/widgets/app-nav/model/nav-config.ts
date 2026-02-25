import {
    AppstoreOutlined,
    BankOutlined,
    CreditCardOutlined,
    HomeOutlined,
    TableOutlined,
    UnorderedListOutlined
} from '@ant-design/icons-vue'

import { ROUTE_NAMES } from '@/shared/config/router'

import type { Component } from 'vue'

export interface NavItem {
    name: string
    label: string
    icon: Component
}

/** Конфиг пунктов главной навигации приложения (порядок: дашборд → счета → категории → бюджеты → планирование → транзакции). */
export const APP_NAV_ITEMS: NavItem[] = [
    { name: ROUTE_NAMES.HOME, label: 'Дашборд', icon: HomeOutlined },
    { name: ROUTE_NAMES.ACCOUNTS, label: 'Счета', icon: CreditCardOutlined },
    { name: ROUTE_NAMES.CATEGORIES, label: 'Категории', icon: AppstoreOutlined },
    { name: ROUTE_NAMES.BUDGETS, label: 'Бюджеты', icon: BankOutlined },
    { name: ROUTE_NAMES.BUDGET_PLANS, label: 'Планирование', icon: TableOutlined },
    { name: ROUTE_NAMES.TRANSACTIONS, label: 'Транзакции', icon: UnorderedListOutlined }
]
