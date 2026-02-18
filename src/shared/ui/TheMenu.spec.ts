import { mountWithProviders } from '@test/utils'
import { describe, it, expect } from 'vitest'

import TheMenu from './TheMenu.vue'

describe('TheMenu', () => {
    it('рендерит с корневым классом the-menu', () => {
        const wrapper = mountWithProviders(TheMenu)
        expect(wrapper.find('.the-menu').exists()).toBe(true)
    })

    it('передаёт mode и items', () => {
        const wrapper = mountWithProviders(TheMenu, {
            props: { mode: 'horizontal', items: [{ key: '1', label: 'Item' }] }
        })
        expect(wrapper.find('.the-menu').exists()).toBe(true)
    })
})
