<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed } from 'vue'

import { TheButton, TheForm, TheInput } from '@/shared/ui'

import { budgetFormSchema } from '../model/BudgetForm.schema'
import { budgetFormInitialValues } from '../model/BudgetForm.types'

import type { BudgetFormValues } from '../model/BudgetForm.types'

const props = withDefaults(defineProps<{ initialValues?: Partial<BudgetFormValues> }>(), { initialValues: undefined })

const { handleSubmit, isSubmitting, resetForm } = useForm<BudgetFormValues>({
    validationSchema: toTypedSchema(budgetFormSchema),
    initialValues: { ...budgetFormInitialValues, ...props.initialValues }
})

const canSubmit = computed(() => !isSubmitting.value)

const emit = defineEmits<{ submit: [values: BudgetFormValues] }>()

function onSubmit(values: BudgetFormValues) {
    emit('submit', values)
}

function formSubmitHandler(e: SubmitEvent) {
    handleSubmit(onSubmit)(e)
}

defineExpose({ submit: handleSubmit, resetForm })
</script>

<template>
    <div
        class="budget-form"
        @keydown.enter.prevent="formSubmitHandler($event as unknown as SubmitEvent)"
    >
        <TheForm
            class="budget-form__form"
            @submit="formSubmitHandler"
        >
            <TheInput
                name="name"
                label="Название"
                placeholder="Бюджет"
            />
            <TheInput
                name="currency"
                label="Валюта"
                placeholder="RUB"
            />
            <TheInput
                name="initialBalance"
                label="Начальный баланс (опционально)"
                placeholder="0"
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
.budget-form,
.budget-form__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>
