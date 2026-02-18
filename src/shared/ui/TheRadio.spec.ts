import { mountWithProviders } from '@test/utils'
import { describe, it, expect } from 'vitest'

import TheRadio from './TheRadio.vue'

describe('TheRadio', () => {
    it('рендерит с корневым классом the-radio', () => {
        const wrapper = mountWithProviders(TheRadio, {
            props: { name: 'choice', options: [{ label: 'A', value: 'a' }] }
        })
        expect(wrapper.find('.the-radio').exists()).toBe(true)
    })
})
