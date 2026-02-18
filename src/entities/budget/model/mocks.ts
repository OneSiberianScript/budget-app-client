import type { Budget } from './types'

/** Моковые бюджеты для разработки и тестов. */
export const MOCK_BUDGETS: Budget[] = [
    {
        id: 'budget-1',
        name: 'Дом',
        currency: 'RUB',
        initialBalance: '0',
        ownerId: 'user-1',
        createdAt: '2025-01-15T10:00:00.000Z',
        updatedAt: '2025-02-01T12:00:00.000Z'
    },
    {
        id: 'budget-2',
        name: 'Отдых',
        currency: 'RUB',
        initialBalance: '0',
        ownerId: 'user-1',
        createdAt: '2025-01-20T09:00:00.000Z',
        updatedAt: '2025-01-20T09:00:00.000Z'
    },
    {
        id: 'budget-3',
        name: 'Авто',
        currency: 'RUB',
        initialBalance: '0',
        ownerId: 'user-1',
        createdAt: '2025-02-01T08:00:00.000Z',
        updatedAt: '2025-02-10T14:00:00.000Z'
    }
]
