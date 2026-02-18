import { mountWithProviders } from '@test/utils'
import { describe, it, expect } from 'vitest'

import TheTabs from './TheTabs.vue'

describe('TheTabs', () => {
    it('рендерит с корневым классом the-tabs', () => {
        const wrapper = mountWithProviders(TheTabs, {
            props: {
                items: [
                    { key: '1', label: 'Tab 1' },
                    { key: '2', label: 'Tab 2' }
                ]
            }
        })
        expect(wrapper.find('.the-tabs').exists()).toBe(true)
    })
})
