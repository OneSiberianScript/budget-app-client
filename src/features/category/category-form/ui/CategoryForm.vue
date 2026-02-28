<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed } from 'vue'

import {
    CATEGORY_COLOR_OPTIONS,
    CATEGORY_ICON_OPTIONS,
    getCategoryIconComponent,
    useCategoryStore
} from '@/entities/category'

import { TheButton, TheColorGrid, TheForm, TheIconGrid, TheInput, TheSelect, TheTag } from '@/shared/ui'

import { categoryFormSchema } from '../model/CategoryForm.schema'
import { categoryFormInitialValues } from '../model/CategoryForm.types'

import type { CategoryFormValues } from '../model/CategoryForm.types'

const props = withDefaults(
    defineProps<{
        /** Начальные значения (для редактирования) */
        initialValues?: Partial<CategoryFormValues>
        /** Использовать сетки вместо TheSelect для выбора цвета и иконки (для мобильных страниц) */
        gridPickers?: boolean
    }>(),
    { initialValues: undefined, gridPickers: false }
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

const categoryStore = useCategoryStore()

const usedColors = computed(() => {
    const currentColor = props.initialValues?.color ?? null
    return categoryStore.categories.map((c) => c.color).filter((c): c is string => !!c && c !== currentColor)
})

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
            <template v-if="props.gridPickers">
                <TheColorGrid
                    name="color"
                    label="Цвет"
                    :options="CATEGORY_COLOR_OPTIONS"
                    :disabled-values="usedColors"
                />
                <TheIconGrid
                    name="icon"
                    label="Иконка"
                    :options="CATEGORY_ICON_OPTIONS"
                >
                    <template #option="{ option }">
                        <component
                            :is="getCategoryIconComponent(option.value)"
                            class="category-form__grid-icon"
                            aria-hidden
                        />
                    </template>
                </TheIconGrid>
            </template>
            <template v-else>
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
            </template>
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

/* Иконка в выпадающем списке TheSelect — нужен отступ от текста */
.category-form__option-icon {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 8px;
    vertical-align: middle;
}

/* Иконка в сетке TheIconGrid — центрируется flex-контейнером, отступ не нужен */
.category-form__grid-icon {
    width: 1.5rem;
    height: 1.5rem;
    display: block;
}
</style>
