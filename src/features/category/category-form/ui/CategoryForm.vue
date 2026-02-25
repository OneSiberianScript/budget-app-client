<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed } from 'vue'

import { getCategoryIconComponent, CATEGORY_COLOR_OPTIONS, CATEGORY_ICON_OPTIONS } from '@/entities/category'

import { TheButton, TheForm, TheInput, TheSelect, TheTag } from '@/shared/ui'

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
            <TheSelect
                name="color"
                label="Цвет"
                placeholder="Выберите цвет"
                :options="CATEGORY_COLOR_OPTIONS"
            >
                <template #option="{ option }">
                    <TheTag
                        v-if="option?.value != null"
                        :color="String(option.value)"
                    >
                        {{ option?.label }}
                    </TheTag>
                    <span v-else>{{ option?.label }}</span>
                </template>
            </TheSelect>
            <TheSelect
                name="icon"
                label="Иконка"
                placeholder="Выберите иконку"
                :options="CATEGORY_ICON_OPTIONS"
            >
                <template #option="{ option }">
                    <component
                        :is="getCategoryIconComponent(option?.value != null ? String(option.value) : null)"
                        class="category-form__option-icon"
                        aria-hidden
                    />
                    <span>{{ option?.label }}</span>
                </template>
            </TheSelect>
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

.category-form__option-icon {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 8px;
    vertical-align: middle;
}
</style>
