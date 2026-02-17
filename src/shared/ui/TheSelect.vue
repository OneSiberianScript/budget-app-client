<script setup lang="ts">
import { Form, Select } from 'ant-design-vue'
import { useField } from 'vee-validate'

type Option = { label: string; value: string | number }

type Props = {
    /** Имя поля для VeeValidate (должно совпадать с ключом в схеме формы) */
    name: string
    /** Подпись над полем; используется для aria-label (E2E getByLabel) */
    label?: string
    /** Placeholder при пустом выборе */
    placeholder?: string
    /** Список опций { label, value } */
    options?: Option[]
    /** Неактивно */
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    label: '',
    placeholder: undefined,
    options: () => [],
    disabled: false
})

const { value, errorMessage } = useField<string | number | undefined>(() => props.name)
</script>

<template>
    <Form.Item
        :label="label"
        :validate-status="errorMessage ? 'error' : undefined"
        :help="errorMessage"
    >
        <Select
            :id="name"
            v-model:value="value"
            class="the-select"
            :placeholder="placeholder"
            :options="options"
            :disabled="disabled"
            :aria-label="label || name"
            allow-clear
        />
    </Form.Item>
</template>
