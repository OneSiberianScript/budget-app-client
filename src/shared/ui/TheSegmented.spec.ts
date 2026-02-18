import { mountWithProviders } from '@test/utils'
import { describe, it, expect } from 'vitest'

import TheSegmented from './TheSegmented.vue'

describe('TheSegmented', () => {
    it('рендерит с корневым классом the-segmented', () => {
        const wrapper = mountWithProviders(TheSegmented, {
            props: { options: [{ label: 'A', value: 'a' }] }
        })
        expect(wrapper.find('.the-segmented').exists()).toBe(true)
    })
})
