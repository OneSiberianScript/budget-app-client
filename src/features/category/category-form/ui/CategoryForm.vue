<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed } from 'vue'

import { TheButton, TheInput, TheSelect } from '@/shared/ui'

import { categoryFormSchema } from '../model/CategoryForm.schema'
import { categoryFormInitialValues } from '../model/CategoryForm.types'

import type { CategoryFormValues } from '../model/CategoryForm.types'

const props = withDefaults(
    defineProps<{
        /** Начальные значения (для редактирования) */
        initialValues?: Partial<CategoryFormValues>
    }>(),
    { initialValues: undefined }
)

const { handleSubmit, meta, isSubmitting, resetForm } = useForm<CategoryFormValues>({
    validationSchema: toTypedSchema(categoryFormSchema),
    initialValues: { ...categoryFormInitialValues, ...props.initialValues }
})

const canSubmit = computed(() => meta.value.valid && !isSubmitting.value)

const typeOptions = [
    { label: 'Расход', value: 'expense' },
    { label: 'Доход', value: 'income' },
    { label: 'Перевод', value: 'transfer' },
    { label: 'Накопление', value: 'saving' }
]

const emit = defineEmits<{ submit: [values: CategoryFormValues] }>()

function onSubmit(values: CategoryFormValues) {
    emit('submit', values)
}

defineExpose({ submit: handleSubmit, resetForm })
</script>

<template>
    <form
        class="category-form"
        @submit.prevent="handleSubmit(onSubmit)"
    >
        <TheInput
            name="name"
            label="Название"
            placeholder="Категория"
        />
        <TheSelect
            name="type"
            label="Тип"
            placeholder="Выберите тип"
            :options="typeOptions"
        />
        <TheInput
            name="color"
            label="Цвет"
            placeholder="Например #hex или название (необязательно)"
        />
        <TheInput
            name="icon"
            label="Иконка"
            placeholder="Название иконки (необязательно)"
        />
        <TheButton
            type="primary"
            html-type="submit"
            :loading="isSubmitting"
            :disabled="!canSubmit"
        >
            Сохранить
        </TheButton>
    </form>
</template>

<style scoped>
.category-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>
