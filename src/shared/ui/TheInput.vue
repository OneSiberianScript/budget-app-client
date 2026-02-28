<script setup lang="ts">
import { Form, Input } from 'ant-design-vue'
import { useField } from 'vee-validate'

type Props = {
    /** Имя поля для VeeValidate (должно совпадать с ключом в схеме формы) */
    name: string
    /** Подпись над полем; используется для aria-label (E2E getByLabel) */
    label?: string
    /** Placeholder в пустом поле */
    placeholder?: string
    /** Тип инпута */
    type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url' | 'date'
    /** Подсказка для клавиатуры на мобильных (decimal — цифры с запятой/точкой) */
    inputmode?: 'decimal' | 'numeric' | 'tel' | 'email' | 'url' | 'text' | 'search' | 'none'
    /** Атрибут autocomplete */
    autocomplete?: string
    /** Неактивно */
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    label: '',
    placeholder: undefined,
    type: 'text' as const,
    inputmode: undefined,
    autocomplete: undefined,
    disabled: false
})

const { value, errorMessage } = useField<string>(() => props.name)
</script>

<template>
    <Form.Item
        :label="label"
        :validate-status="errorMessage ? 'error' : undefined"
        :help="errorMessage"
    >
        <Input
            :id="name"
            v-model:value="value"
            class="the-input"
            :placeholder="placeholder"
            :type="type"
            :inputmode="inputmode"
            :autocomplete="autocomplete"
            :disabled="disabled"
            :aria-label="label || name"
        />
    </Form.Item>
</template>
