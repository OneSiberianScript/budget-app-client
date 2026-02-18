import { mountWithProviders } from '@test/utils'
import { describe, it, expect } from 'vitest'

import ThePagination from './ThePagination.vue'

describe('ThePagination', () => {
    it('рендерит с корневым классом the-pagination', () => {
        const wrapper = mountWithProviders(ThePagination, {
            props: { total: 100 }
        })
        expect(wrapper.find('.the-pagination').exists()).toBe(true)
    })

    it('передаёт current и total', () => {
        const wrapper = mountWithProviders(ThePagination, {
            props: { current: 2, total: 50, pageSize: 10 }
        })
        expect(wrapper.find('.the-pagination').exists()).toBe(true)
    })
})
