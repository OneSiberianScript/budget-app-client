import { vi } from 'vitest'

/**
 * Моки для API-запросов в тестах.
 * Использование: vi.mock('@/entities/session/api', () => ({ ...apiMocks.session }))
 */
export const apiMocks = {
    session: {
        login: vi.fn().mockResolvedValue({
            accessToken: 'test-access-token',
            sessionId: 'session-1',
            user: { id: 'user-1', email: 'test@example.com', firstName: 'Test', lastName: 'User' }
        }),
        register: vi.fn().mockResolvedValue({
            accessToken: 'test-access-token',
            sessionId: 'session-1',
            user: { id: 'user-1', email: 'test@example.com', firstName: 'Test', lastName: 'User' }
        }),
        refresh: vi.fn().mockResolvedValue({
            accessToken: 'refreshed-token',
            sessionId: 'session-1'
        }),
        logout: vi.fn().mockResolvedValue(undefined),
        confirmEmail: vi.fn().mockResolvedValue(undefined)
    }
}
