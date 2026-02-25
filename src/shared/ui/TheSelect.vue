<script setup lang="ts">
import { Form, Select } from 'ant-design-vue'
import { useField } from 'vee-validate'
import { computed } from 'vue'

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

/** Для a-select: value не принимает null, нормализуем null ↔ undefined. */
const selectValue = computed({
    get: () => (value.value === null ? undefined : value.value),
    set: (v: string | number | undefined | null) => {
        value.value = v === undefined ? null : v
    }
})
</script>

<template>
    <Form.Item
        :label="label"
        :validate-status="errorMessage ? 'error' : undefined"
        :help="errorMessage"
    >
        <Select
            :id="name"
            v-model:value="selectValue"
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
