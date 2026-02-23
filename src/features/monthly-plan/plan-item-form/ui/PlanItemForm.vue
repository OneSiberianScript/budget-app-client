<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed } from 'vue'

import { TheButton, TheForm, TheInputNumber, TheSelect } from '@/shared/ui'

import { planItemFormSchema } from '../model/PlanItemForm.schema'
import { planItemFormInitialValues } from '../model/PlanItemForm.types'

import type { PlanItemFormValues } from '../model/PlanItemForm.types'

interface Props {
    categoryOptions: { label: string; value: string }[]
    initialValues?: Partial<PlanItemFormValues>
}

const props = withDefaults(defineProps<Props>(), { initialValues: undefined })

const { handleSubmit, isSubmitting, resetForm } = useForm<PlanItemFormValues>({
    validationSchema: toTypedSchema(planItemFormSchema),
    initialValues: { ...planItemFormInitialValues, ...props.initialValues }
})

const canSubmit = computed(() => !isSubmitting.value)

const emit = defineEmits<{ submit: [values: PlanItemFormValues] }>()

function onSubmit(values: PlanItemFormValues) {
    emit('submit', values)
}

function formSubmitHandler(e: SubmitEvent) {
    handleSubmit(onSubmit)(e)
}

defineExpose({ submit: handleSubmit, resetForm })
</script>

<template>
    <div
        class="plan-item-form"
        @keydown.enter.prevent="formSubmitHandler($event as unknown as SubmitEvent)"
    >
        <TheForm
            class="plan-item-form__form"
            @submit="formSubmitHandler"
        >
            <TheSelect
                name="categoryId"
                label="Категория"
                placeholder="Выберите категорию"
                :options="categoryOptions"
            />
            <TheInputNumber
                name="limitRub"
                label="Лимит (руб)"
                :min="0"
                :precision="2"
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
.plan-item-form,
.plan-item-form__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>
