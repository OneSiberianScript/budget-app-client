import { mountWithProviders } from '@test/utils'
import { describe, it, expect } from 'vitest'

import TheTooltip from './TheTooltip.vue'

describe('TheTooltip', () => {
    it('рендерит с корневым классом the-tooltip', () => {
        const wrapper = mountWithProviders(TheTooltip, {
            props: { title: 'Hint' },
            slots: { default: () => 'Text' }
        })
        expect(wrapper.find('.the-tooltip').exists()).toBe(true)
    })
})
