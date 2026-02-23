<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed } from 'vue'

import { TheButton, TheForm, TheInput, TheSelect } from '@/shared/ui'

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

const { handleSubmit, isSubmitting, resetForm } = useForm<CategoryFormValues>({
    validationSchema: toTypedSchema(categoryFormSchema),
    initialValues: { ...categoryFormInitialValues, ...props.initialValues }
})

const canSubmit = computed(() => !isSubmitting.value)

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

function formSubmitHandler(e: SubmitEvent) {
    handleSubmit(onSubmit)(e)
}

defineExpose({ submit: handleSubmit, resetForm })
</script>

<template>
    <div
        class="category-form"
        @keydown.enter.prevent="formSubmitHandler($event as unknown as SubmitEvent)"
    >
        <TheForm
            class="category-form__form"
            @submit="formSubmitHandler"
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
                @click.prevent="formSubmitHandler($event as unknown as SubmitEvent)"
            >
                Сохранить
            </TheButton>
        </TheForm>
    </div>
</template>

<style scoped>
.category-form,
.category-form__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>
