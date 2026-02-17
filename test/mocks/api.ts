import { vi } from 'vitest'

/**
 * Моки для API-запросов в тестах.
 * Использование: vi.mock('@/entities/session/api', () => ({ ...apiMocks.session }))
 */
export const apiMocks = {
    session: {
        login: vi.fn().mockResolvedValue({
            accessToken: 'test-access-token',
            user: { id: 'user-1', email: 'test@example.com', firstName: 'Test', lastName: 'User' }
        }),
        register: vi.fn().mockResolvedValue({
            accessToken: 'test-access-token',
            user: { id: 'user-1', email: 'test@example.com', firstName: 'Test', lastName: 'User' }
        }),
        refresh: vi.fn().mockResolvedValue({
            accessToken: 'refreshed-token',
            user: { id: 'user-1', email: 'test@example.com', firstName: 'Test', lastName: 'User' }
        }),
        logout: vi.fn().mockResolvedValue(undefined),
        confirmEmail: vi.fn().mockResolvedValue(undefined)
    }
}
