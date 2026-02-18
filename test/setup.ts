import { vi } from 'vitest'

vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
    }))
)

vi.stubGlobal(
    'ResizeObserver',
    class ResizeObserver {
        observe = vi.fn()
        unobserve = vi.fn()
        disconnect = vi.fn()
    }
)

vi.stubGlobal(
    'IntersectionObserver',
    class IntersectionObserver {
        observe = vi.fn()
        unobserve = vi.fn()
        disconnect = vi.fn()
    }
)

vi.mock('@/shared/lib/message', () => ({
    message: {
        success: vi.fn(),
        error: vi.fn(),
        warning: vi.fn(),
        info: vi.fn()
    }
}))
