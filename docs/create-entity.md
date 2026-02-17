# Создание сущности (entity)

Как добавить entity в FSD: типы, store, API, соглашения.

## Когда создавать entity

Бизнес-объект с id и полями, состояние которого нужно в нескольких местах (страницы, фичи, виджеты). Примеры: аккаунт, сессия, проект. Если есть список (`/accounts`) и детали (`/accounts/:id`) — entity оправдана.

## Структура

```
src/entities/{entity-name}/
├── model/
│   ├── types.ts       # Типы сущности
│   └── store.ts       # Pinia store
├── api/
│   └── index.ts       # Запросы к API
└── index.ts           # Экспорт store, типов, api
```

Пример: `src/entities/account/`.

## 1. Типы (`model/types.ts`)

Интерфейс сущности по контракту бэкенда или экранам. Вложенные типы — по мере надобности.

```typescript
export type AccountStatus = 'active' | 'inactive' | 'pending'

export interface Account {
    id: number
    name: string
    email: string
    role: string
    status: AccountStatus
    createdAt: string
    lastLogin: string | null
    settings?: AccountSettings
}
```

## 2. API (`api/index.ts`)

API сущности живёт в entity, не в `shared/api`. В shared — только `request`, `httpClient`, `useApi`.

Функции: список, по id, обновление, удаление. Внутри — `request()` из `@/shared/api/request`.

Пока бэкенда нет: в теле — комментарий о будущем вызове. Без моков и `Promise.resolve`. Для компиляции — `throw new Error('Not implemented')`.

```typescript
export async function fetchAccounts(): Promise<Account[]>
export async function fetchAccountById(id: string): Promise<Account>
export async function updateAccountSettings(id: string, payload: Partial<AccountSettings>): Promise<Account>
export async function deleteAccount(id: string): Promise<void>
```

## 3. Store (`model/store.ts`)

Pinia composition API (как в `entities/session`).

Состояние: `accounts: Ref<Account[]>`, если список нужен в нескольких местах. Геттер `getAccountById(id)` — по необходимости.

Действия: `setAccounts`, `setAccount`, `removeAccount` — работа с локальным состоянием. `fetchAccounts()` — пока только комментарий (вызвать api → setAccounts).

Список в store — если используется на нескольких страницах. Одна сущность — аналогично: store, если нужна в формах/виджетах; иначе — локальный ref на странице.

Действия объявлять через **function**, не стрелочные: hoisting, имя в стеке вызовов.

```typescript
function setAccounts(list: Account[]) {
    accounts.value = list
}

function setAccount(account: Account) {
    const index = accounts.value.findIndex((a) => a.id === account.id)
    if (index >= 0) accounts.value[index] = account
    else accounts.value.push(account)
}

async function fetchAccounts() {
    // TODO: const list = await accountApi.fetchAccounts(); setAccounts(list)
}
```

## 4. Публичный API (`index.ts`)

```typescript
export { useAccountStore } from './model/store'
export type { Account, AccountStatus, AccountSettings } from './model/types'
export { fetchAccounts, fetchAccountById, updateAccountSettings, deleteAccount } from './api'
```

## FSD

Entity импортирует только из shared. Features и pages импортируют entity. Фичи вызывают API и обновляют store; страницы читают из store.

## Моки

Не подключать в entity api и store. Тип может совпадать с моками в `shared/mocks`; маппинг — когда появится бэкенд.

## Чеклист

1. `model/types.ts` — интерфейсы
2. `api/index.ts` — функции (пока комментарии в теле)
3. `model/store.ts` — состояние, действия, загрузка с комментарием
4. `index.ts` — экспорт
5. Подключить store на страницах, фичи вызывают api и обновляют store
6. JSDoc для типов, API-функций и действий store (см. [guide-documentation.md](./guide-documentation.md))
7. Тесты для store и/или API при неочевидной логике (см. [guide-testing.md](./guide-testing.md))
