import { mountWithProviders } from '@test/utils'
import { describe, it, expect } from 'vitest'

import TheDatePicker from './TheDatePicker.vue'

describe('TheDatePicker', () => {
    it('рендерит с корневым классом the-date-picker в режиме формы', () => {
        const wrapper = mountWithProviders(TheDatePicker, {
            props: { name: 'date' }
        })
        expect(wrapper.find('.the-date-picker').exists()).toBe(true)
    })

    it('в автономном режиме рендерит обёртку и пикер с классом the-date-picker', () => {
        const wrapper = mountWithProviders(TheDatePicker, {
            props: { picker: 'month', label: 'Период' }
        })
        expect(wrapper.find('.the-date-picker-standalone').exists()).toBe(true)
        expect(wrapper.find('.the-date-picker').exists()).toBe(true)
        expect(wrapper.text()).toContain('Период')
    })
})
