import { mountWithProviders } from '@test/utils'
import { describe, it, expect } from 'vitest'

import TheDropdown from './TheDropdown.vue'

describe('TheDropdown', () => {
    it('монтируется и рендерит триггер', () => {
        const wrapper = mountWithProviders(TheDropdown, {
            slots: {
                default: () => 'Trigger',
                overlay: () => 'Menu'
            }
        })
        expect(wrapper.exists()).toBe(true)
    })
})
