<script setup lang="ts">
import { Form, Select } from 'ant-design-vue'
import { useField } from 'vee-validate'

type Option = { label: string; value: string | number }

type Props = {
    /** Field name for VeeValidate (must match schema key) */
    name: string
    /** Label; also used for aria-label (E2E getByLabel) */
    label?: string
    placeholder?: string
    options?: Option[]
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
            :placeholder="placeholder"
            :options="options"
            :disabled="disabled"
            :aria-label="label || name"
            allow-clear
        />
    </Form.Item>
</template>
