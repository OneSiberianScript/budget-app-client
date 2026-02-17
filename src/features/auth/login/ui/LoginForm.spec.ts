import { mountWithProviders } from '@test/utils'
import { flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import LoginForm from './LoginForm.vue'

vi.mock('@/entities/session/api', () => ({
    login: vi.fn()
}))

describe('LoginForm', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('рендерит поля email и пароль и кнопку входа', async () => {
        const wrapper = mountWithProviders(LoginForm, { route: '/auth/login' })
        await flushPromises()

        expect(wrapper.find('input[type="email"]').exists()).toBe(true)
        expect(wrapper.find('input[type="password"]').exists()).toBe(true)
        expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
    })
})
