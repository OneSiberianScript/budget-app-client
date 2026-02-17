<script setup lang="ts">
import { Checkbox, Form } from 'ant-design-vue'
import { useField } from 'vee-validate'

interface Props {
    /** Имя поля для VeeValidate (должно совпадать с ключом в схеме формы) */
    name: string
    /** Подпись над полем; используется для aria-label (E2E getByLabel) */
    label?: string
    /** Текст рядом с чекбоксом */
    checkboxLabel?: string
    /** Неактивно */
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    label: '',
    checkboxLabel: '',
    disabled: false
})

const { value, errorMessage } = useField<boolean>(() => props.name)
</script>

<template>
    <Form.Item
        :label="label"
        :validate-status="errorMessage ? 'error' : undefined"
        :help="errorMessage"
    >
        <Checkbox
            :id="name"
            v-model:checked="value"
            :disabled="disabled"
            :aria-label="label || name"
        >
            {{ checkboxLabel }}
        </Checkbox>
    </Form.Item>
</template>
