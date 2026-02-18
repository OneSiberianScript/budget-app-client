import { mountWithProviders } from '@test/utils'
import { describe, it, expect } from 'vitest'

import TheBadge from './TheBadge.vue'

describe('TheBadge', () => {
    it('рендерит с корневым классом the-badge', () => {
        const wrapper = mountWithProviders(TheBadge, {
            slots: { default: () => 'Content' }
        })
        expect(wrapper.find('.the-badge').exists()).toBe(true)
    })

    it('передаёт count', () => {
        const wrapper = mountWithProviders(TheBadge, {
            props: { count: 5 },
            slots: { default: () => 'Content' }
        })
        expect(wrapper.find('.the-badge').exists()).toBe(true)
    })
})
