<script setup lang="ts">
import { Form, Select } from 'ant-design-vue'
import { useField } from 'vee-validate'

/** Опция селекта; в слоте option доступны и дополнительные поля (например logoUrl) */
export type Option = {
    label: string
    value: string | number | null
    logoUrl?: string | null
}

type Props = {
    /** Имя поля для VeeValidate (должно совпадать с ключом в схеме формы) */
    name: string
    /** Подпись над полем; используется для aria-label (E2E getByLabel) */
    label?: string
    /** Placeholder при пустом выборе */
    placeholder?: string
    /** Список опций { label, value } (доп. поля доступны в слоте option) */
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

defineSlots<{
    /** Кастомный рендер опции в выпадающем списке (получает объект опции) */
    option?: (props: { option: Option }) => unknown
}>()

const { value, errorMessage } = useField<string | number | undefined | null>(() => props.name)
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
        >
            <template
                v-if="$slots.option"
                #option="slotProps"
            >
                <slot
                    name="option"
                    :option="slotProps"
                />
            </template>
        </Select>
    </Form.Item>
</template>
