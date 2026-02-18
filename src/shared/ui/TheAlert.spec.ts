import { mountWithProviders } from '@test/utils'
import { describe, it, expect } from 'vitest'

import TheAlert from './TheAlert.vue'

describe('TheAlert', () => {
    it('рендерит с корневым классом the-alert', () => {
        const wrapper = mountWithProviders(TheAlert, {
            props: { message: 'Test' }
        })
        expect(wrapper.find('.the-alert').exists()).toBe(true)
    })

    it('передаёт type и message', () => {
        const wrapper = mountWithProviders(TheAlert, {
            props: { type: 'success', message: 'Done' }
        })
        expect(wrapper.find('.the-alert').exists()).toBe(true)
    })
})
