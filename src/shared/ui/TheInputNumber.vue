<script setup lang="ts">
import { Form, InputNumber } from 'ant-design-vue'
import { useField } from 'vee-validate'

interface Props {
    /** Имя поля для VeeValidate (должно совпадать с ключом в схеме формы) */
    name: string
    /** Подпись над полем; используется для aria-label (E2E getByLabel) */
    label?: string
    /** Placeholder в пустом поле */
    placeholder?: string
    /** Неактивно */
    disabled?: boolean
    /** Минимальное значение */
    min?: number
    /** Максимальное значение */
    max?: number
    /** Шаг изменения */
    step?: number
    /** Количество знаков после запятой */
    precision?: number
}

const props = withDefaults(defineProps<Props>(), {
    label: '',
    placeholder: undefined,
    disabled: false,
    min: undefined,
    max: undefined,
    step: undefined,
    precision: undefined
})

const { value, errorMessage } = useField<number | undefined>(() => props.name)
</script>

<template>
    <Form.Item
        :label="label"
        :validate-status="errorMessage ? 'error' : undefined"
        :help="errorMessage"
    >
        <InputNumber
            :id="name"
            v-model:value="value"
            :placeholder="placeholder"
            :disabled="disabled"
            :min="min"
            :max="max"
            :step="step"
            :precision="precision"
            inputmode="decimal"
            :aria-label="label || name"
            class="the-input-number"
            style="width: 100%"
        />
    </Form.Item>
</template>
