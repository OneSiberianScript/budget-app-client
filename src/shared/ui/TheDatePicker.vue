<script setup lang="ts">
import { DatePicker, Form } from 'ant-design-vue'
import dayjs from 'dayjs'
import { useField } from 'vee-validate'
import { computed, ref, watch } from 'vue'

/**
 * Обёртка над a-date-picker. Поддерживает режим с VeeValidate (форма) и автономный режим (v-model).
 * В режиме месяца значение — строка YYYY-MM.
 */
interface Props {
    /** Имя поля для VeeValidate (при использовании внутри формы). Если не задано — автономный режим с v-model. */
    name?: string
    /** Подпись над полем; используется для aria-label (E2E getByLabel). */
    label?: string
    /** Placeholder при пустом выборе. */
    placeholder?: string
    /** Неактивно. */
    disabled?: boolean
    /** Формат отображаемой даты (для picker="date") или месяца (для picker="month"). */
    format?: string
    /** Режим выбора: дата или только месяц. При month значение/модель — строка YYYY-MM. */
    picker?: 'date' | 'month'
    /** Значение в автономном режиме (v-model): для date — строка ISO или dayjs, для month — YYYY-MM. */
    modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
    name: undefined,
    label: '',
    placeholder: 'Выберите дату',
    disabled: false,
    picker: 'date',
    modelValue: undefined,
    format: undefined
})

const emit = defineEmits<{
    'update:modelValue': [value: string | undefined]
}>()

const isStandalone = computed(() => props.name == null || props.name === '')

const formField = useField<string | undefined>(() => props.name ?? '_', undefined, {
    standalone: !props.name
})
const standaloneValue = ref<string | undefined>(props.modelValue)

const effectiveValue = computed(() => (isStandalone.value ? standaloneValue.value : formField.value.value))

const displayFormat = computed(() => {
    if (props.format) return props.format
    return props.picker === 'month' ? 'MM.YYYY' : 'DD.MM.YYYY'
})

/** Для a-date-picker: dayjs или undefined. */
const pickerValue = computed(() => {
    const v = effectiveValue.value
    if (v == null || v === '') return undefined
    if (props.picker === 'month') {
        const parsed = dayjs(v, 'YYYY-MM', true)
        return parsed.isValid() ? parsed : undefined
    }
    const parsed = dayjs(v)
    return parsed.isValid() ? parsed : undefined
})

function onPickerChange(val: unknown) {
    if (val == null || val === '') {
        const next: undefined = undefined
        if (isStandalone.value) {
            standaloneValue.value = next
            emit('update:modelValue', next)
        } else {
            formField.setValue(next)
        }
        return
    }
    const d = dayjs.isDayjs(val) ? val : dayjs(val as string)
    const next = d.isValid() ? (props.picker === 'month' ? d.format('YYYY-MM') : d.format('YYYY-MM-DD')) : undefined
    if (isStandalone.value) {
        standaloneValue.value = next
        emit('update:modelValue', next)
    } else {
        formField.setValue(next)
    }
}

watch(
    () => props.modelValue,
    (v) => {
        if (isStandalone.value) standaloneValue.value = v
    },
    { immediate: true }
)
</script>

<template>
    <Form.Item
        v-if="!isStandalone"
        :label="label"
        :validate-status="formField.errorMessage?.value ? 'error' : undefined"
        :help="formField.errorMessage?.value"
    >
        <DatePicker
            :id="name"
            :value="pickerValue"
            class="the-date-picker"
            :placeholder="placeholder"
            :disabled="disabled"
            :format="displayFormat"
            :picker="picker"
            :aria-label="label || name"
            style="width: 100%"
            @update:value="onPickerChange"
        />
    </Form.Item>
    <div
        v-else
        class="the-date-picker-standalone"
    >
        <label
            v-if="label"
            class="the-date-picker-standalone__label"
            :for="`date-picker-${picker}-standalone`"
        >
            {{ label }}
        </label>
        <DatePicker
            :id="`date-picker-${picker}-standalone`"
            :value="pickerValue"
            class="the-date-picker"
            :placeholder="placeholder"
            :disabled="disabled"
            :format="displayFormat"
            :picker="picker"
            :aria-label="label || 'Период'"
            style="width: 100%"
            @update:value="onPickerChange"
        />
    </div>
</template>

<style scoped>
.the-date-picker-standalone__label {
    display: block;
    margin-bottom: 4px;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
}
</style>
