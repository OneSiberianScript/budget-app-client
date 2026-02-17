<script setup lang="ts">
import { Form, Input } from 'ant-design-vue'
import { useField } from 'vee-validate'

type Props = {
    /** Field name for VeeValidate (must match schema key) */
    name: string
    /** Label; also used for aria-label (E2E getByLabel) */
    label?: string
    placeholder?: string
    type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url'
    autocomplete?: string
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    label: '',
    placeholder: undefined,
    type: 'text' as const,
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
            :placeholder="placeholder"
            :type="type"
            :autocomplete="autocomplete"
            :disabled="disabled"
            :aria-label="label || name"
        />
    </Form.Item>
</template>
