import { mountWithProviders } from '@test/utils'
import { describe, it, expect } from 'vitest'

import ThePasswordInput from './ThePasswordInput.vue'

const TestWrapper = {
    components: { ThePasswordInput },
    template: `
        <form>
            <ThePasswordInput name="password" label="Пароль" />
        </form>
    `
}

describe('ThePasswordInput', () => {
    it('рендерит поле пароля и кнопку переключения видимости', () => {
        const wrapper = mountWithProviders(TestWrapper, {
            global: {
                provide: {
                    // VeeValidate form context — минимальный контекст для useField
                    [Symbol.for('vee-validate:form')]: {
                        register: () => {},
                        unregister: () => {},
                        fields: { value: {} },
                        setFieldValue: () => {},
                        setFieldError: () => {},
                        setErrors: () => {},
                        handleSubmit: () => () => {},
                        submitForm: () => {},
                        meta: { value: {} },
                        values: { value: { password: '' } },
                        errors: { value: {} },
                        registerField: () => {}
                    }
                }
            }
        })

        const input = wrapper.find('input')
        expect(input.exists()).toBe(true)
        expect(input.attributes('type')).toBe('password')

        const toggle = wrapper.find('.the-password-input__toggle')
        expect(toggle.exists()).toBe(true)
        expect(toggle.attributes('aria-label')).toBe('Показать пароль')
        expect(toggle.attributes('type')).toBe('button')
    })

    it('по клику на кнопку переключает тип инпута и aria-label', async () => {
        const wrapper = mountWithProviders(TestWrapper, {
            global: {
                provide: {
                    [Symbol.for('vee-validate:form')]: {
                        register: () => {},
                        unregister: () => {},
                        fields: { value: {} },
                        setFieldValue: () => {},
                        setFieldError: () => {},
                        setErrors: () => {},
                        handleSubmit: () => () => {},
                        submitForm: () => {},
                        meta: { value: {} },
                        values: { value: { password: '' } },
                        errors: { value: {} },
                        registerField: () => {}
                    }
                }
            }
        })

        const toggle = wrapper.find('.the-password-input__toggle')
        await toggle.trigger('click')

        expect(wrapper.find('input').attributes('type')).toBe('text')
        expect(toggle.attributes('aria-label')).toBe('Скрыть пароль')

        await toggle.trigger('click')
        expect(wrapper.find('input').attributes('type')).toBe('password')
        expect(toggle.attributes('aria-label')).toBe('Показать пароль')
    })
})
