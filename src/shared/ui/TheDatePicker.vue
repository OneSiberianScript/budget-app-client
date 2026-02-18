<script setup lang="ts">
import { DatePicker, Form } from 'ant-design-vue'
import { useField } from 'vee-validate'

/**
 * Обёртка над a-date-picker с интеграцией VeeValidate. Корневой класс: the-date-picker.
 */
interface Props {
    /** Имя поля для VeeValidate (должно совпадать с ключом в схеме формы) */
    name: string
    /** Подпись над полем; используется для aria-label (E2E getByLabel) */
    label?: string
    /** Placeholder при пустом выборе */
    placeholder?: string
    /** Неактивно */
    disabled?: boolean
    /** Формат отображаемой даты */
    format?: string
}

const props = withDefaults(defineProps<Props>(), {
    label: '',
    placeholder: 'Выберите дату',
    disabled: false,
    format: 'DD.MM.YYYY'
})

const { value, errorMessage } = useField<string | undefined>(() => props.name)
</script>

<template>
    <Form.Item
        :label="label"
        :validate-status="errorMessage ? 'error' : undefined"
        :help="errorMessage"
    >
        <DatePicker
            :id="name"
            v-model:value="value"
            class="the-date-picker"
            :placeholder="placeholder"
            :disabled="disabled"
            :format="format"
            :aria-label="label || name"
            style="width: 100%"
        />
    </Form.Item>
</template>
