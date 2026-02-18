import { mountWithProviders } from '@test/utils'
import { describe, it, expect } from 'vitest'

import TheSwitch from './TheSwitch.vue'

describe('TheSwitch', () => {
    it('рендерит с корневым классом the-switch', () => {
        const wrapper = mountWithProviders(TheSwitch, {
            props: { name: 'enabled' }
        })
        expect(wrapper.find('.the-switch').exists()).toBe(true)
    })
})
