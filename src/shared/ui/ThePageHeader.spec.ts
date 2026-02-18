import { mountWithProviders } from '@test/utils'
import { describe, it, expect } from 'vitest'

import ThePageHeader from './ThePageHeader.vue'

describe('ThePageHeader', () => {
    it('рендерит с корневым классом the-page-header', () => {
        const wrapper = mountWithProviders(ThePageHeader)
        expect(wrapper.find('.the-page-header').exists()).toBe(true)
    })

    it('передаёт title и subTitle', () => {
        const wrapper = mountWithProviders(ThePageHeader, {
            props: { title: 'Page', subTitle: 'Sub' }
        })
        expect(wrapper.find('.the-page-header').exists()).toBe(true)
    })
})
