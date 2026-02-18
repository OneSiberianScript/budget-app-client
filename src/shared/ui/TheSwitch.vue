<script setup lang="ts">
import { Form, Switch } from 'ant-design-vue'
import { useField } from 'vee-validate'

/**
 * Обёртка над a-switch с интеграцией VeeValidate. Корневой класс: the-switch.
 */
interface Props {
    /** Имя поля для VeeValidate (должно совпадать с ключом в схеме формы) */
    name: string
    /** Подпись над полем; используется для aria-label (E2E getByLabel) */
    label?: string
    /** Подписи для состояний включено/выключено */
    checkedChildren?: string
    /** Подпись в выключенном состоянии */
    unCheckedChildren?: string
    /** Неактивно */
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    label: '',
    checkedChildren: undefined,
    unCheckedChildren: undefined,
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
        <Switch
            :id="name"
            v-model:checked="value"
            class="the-switch"
            :checked-children="checkedChildren"
            :un-checked-children="unCheckedChildren"
            :disabled="disabled"
            :aria-label="label || name"
        />
    </Form.Item>
</template>
