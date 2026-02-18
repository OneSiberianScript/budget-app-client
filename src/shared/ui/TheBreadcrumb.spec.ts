import { mountWithProviders } from '@test/utils'
import { describe, it, expect } from 'vitest'

import TheBreadcrumb from './TheBreadcrumb.vue'

describe('TheBreadcrumb', () => {
    it('рендерит с корневым классом the-breadcrumb', () => {
        const wrapper = mountWithProviders(TheBreadcrumb)
        expect(wrapper.find('.the-breadcrumb').exists()).toBe(true)
    })

    it('передаёт routes', () => {
        const wrapper = mountWithProviders(TheBreadcrumb, {
            props: {
                routes: [{ breadcrumbName: 'Home' }, { breadcrumbName: 'Page' }]
            }
        })
        expect(wrapper.find('.the-breadcrumb').exists()).toBe(true)
    })
})
