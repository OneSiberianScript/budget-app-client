<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed } from 'vue'

import { TheButton, TheInput } from '@/shared/ui'

import { budgetFormSchema } from '../model/BudgetForm.schema'
import { budgetFormInitialValues } from '../model/BudgetForm.types'

import type { BudgetFormValues } from '../model/BudgetForm.types'

const props = withDefaults(defineProps<{ initialValues?: Partial<BudgetFormValues> }>(), { initialValues: undefined })

const { handleSubmit, meta, isSubmitting, resetForm } = useForm<BudgetFormValues>({
    validationSchema: toTypedSchema(budgetFormSchema),
    initialValues: { ...budgetFormInitialValues, ...props.initialValues }
})

const canSubmit = computed(() => meta.value.valid && !isSubmitting.value)

const emit = defineEmits<{ submit: [values: BudgetFormValues] }>()

function onSubmit(values: BudgetFormValues) {
    emit('submit', values)
}

defineExpose({ submit: handleSubmit, resetForm })
</script>

<template>
    <form
        class="budget-form"
        @submit.prevent="handleSubmit(onSubmit)"
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
        >
            Сохранить
        </TheButton>
    </form>
</template>

<style scoped>
.budget-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>
