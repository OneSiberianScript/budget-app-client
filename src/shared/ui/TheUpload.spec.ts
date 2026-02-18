import { mountWithProviders } from '@test/utils'
import { describe, it, expect } from 'vitest'

import TheUpload from './TheUpload.vue'

describe('TheUpload', () => {
    it('рендерит с корневым классом the-upload', () => {
        const wrapper = mountWithProviders(TheUpload, {
            props: { name: 'file', action: '/upload' },
            slots: { default: () => 'Upload' }
        })
        expect(wrapper.find('.the-upload').exists()).toBe(true)
    })
})
