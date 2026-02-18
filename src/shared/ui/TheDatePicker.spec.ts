import { mountWithProviders } from '@test/utils'
import { describe, it, expect } from 'vitest'

import TheDatePicker from './TheDatePicker.vue'

describe('TheDatePicker', () => {
    it('рендерит с корневым классом the-date-picker', () => {
        const wrapper = mountWithProviders(TheDatePicker, {
            props: { name: 'date' }
        })
        expect(wrapper.find('.the-date-picker').exists()).toBe(true)
    })
})
