import { mountWithProviders } from '@test/utils'
import { describe, it, expect } from 'vitest'

import TheTag from './TheTag.vue'

describe('TheTag', () => {
    it('рендерит с корневым классом the-tag', () => {
        const wrapper = mountWithProviders(TheTag, {
            slots: { default: () => 'Tag' }
        })
        expect(wrapper.find('.the-tag').exists()).toBe(true)
    })

    it('передаёт color и closable', () => {
        const wrapper = mountWithProviders(TheTag, {
            props: { color: 'blue', closable: true },
            slots: { default: () => 'Tag' }
        })
        expect(wrapper.find('.the-tag').exists()).toBe(true)
    })
})
