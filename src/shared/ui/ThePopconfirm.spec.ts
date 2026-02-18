import { mountWithProviders } from '@test/utils'
import { describe, it, expect } from 'vitest'

import ThePopconfirm from './ThePopconfirm.vue'

describe('ThePopconfirm', () => {
    it('рендерит с корневым классом the-popconfirm', () => {
        const wrapper = mountWithProviders(ThePopconfirm, {
            slots: { default: () => 'Delete' }
        })
        expect(wrapper.find('.the-popconfirm').exists()).toBe(true)
    })
})
