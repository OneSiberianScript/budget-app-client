<script setup lang="ts">
import { Form, RadioGroup } from 'ant-design-vue'
import { useField } from 'vee-validate'

/**
 * Обёртка над a-radio-group с интеграцией VeeValidate. Корневой класс: the-radio.
 */
interface RadioOption {
    label: string
    value: string | number
    disabled?: boolean
}

interface Props {
    /** Имя поля для VeeValidate (должно совпадать с ключом в схеме формы) */
    name: string
    /** Подпись над полем; используется для aria-label (E2E getByLabel) */
    label?: string
    /** Опции выбора (label, value) */
    options?: RadioOption[]
    /** Неактивно */
    disabled?: boolean
    /** Режим кнопок: default, button */
    optionType?: 'default' | 'button'
}

const props = withDefaults(defineProps<Props>(), {
    label: '',
    options: () => [],
    disabled: false,
    optionType: 'default'
})

const { value, errorMessage } = useField<string | number | undefined>(() => props.name)
</script>

<template>
    <Form.Item
        :label="label"
        :validate-status="errorMessage ? 'error' : undefined"
        :help="errorMessage"
    >
        <RadioGroup
            :id="name"
            v-model:value="value"
            class="the-radio"
            :options="options"
            :disabled="disabled"
            :option-type="optionType"
            :aria-label="label || name"
        >
            <slot />
        </RadioGroup>
    </Form.Item>
</template>
