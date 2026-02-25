import { mountWithProviders } from '@test/utils'
import { describe, it, expect } from 'vitest'

import TheDivider from './TheDivider.vue'

describe('TheDivider', () => {
    it('рендерит с корневым классом the-divider', () => {
        const wrapper = mountWithProviders(TheDivider)
        expect(wrapper.find('.the-divider').exists()).toBe(true)
    })

    it('передаёт type, dashed и orientation', () => {
        const wrapper = mountWithProviders(TheDivider, {
            props: { type: 'vertical', dashed: true, orientation: 'left' }
        })
        expect(wrapper.find('.the-divider').exists()).toBe(true)
    })

    it('рендерит слот по умолчанию как текст в линии', () => {
        const wrapper = mountWithProviders(TheDivider, {
            slots: { default: () => 'Раздел' }
        })
        expect(wrapper.text()).toContain('Раздел')
    })
})
