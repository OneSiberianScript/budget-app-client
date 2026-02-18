import { mountWithProviders } from '@test/utils'
import { describe, it, expect } from 'vitest'

import ThePopover from './ThePopover.vue'

describe('ThePopover', () => {
    it('рендерит с корневым классом the-popover', () => {
        const wrapper = mountWithProviders(ThePopover, {
            props: { content: 'Hint' },
            slots: { default: () => 'Trigger' }
        })
        expect(wrapper.find('.the-popover').exists()).toBe(true)
    })
})
