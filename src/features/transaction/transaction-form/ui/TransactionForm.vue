<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed } from 'vue'

import { TheInput, TheInputNumber, TheSelect } from '@/shared/ui'

import { transactionFormSchema } from '../model/TransactionForm.schema'
import { transactionFormInitialValues } from '../model/TransactionForm.types'

import type { TransactionFormValues } from '../model/TransactionForm.types'

interface Props {
    accountOptions: { label: string; value: string }[]
    categoryOptions: { label: string; value: string }[]
    /** Начальные значения (для редактирования) */
    initialValues?: Partial<TransactionFormValues>
}

const props = withDefaults(defineProps<Props>(), { initialValues: undefined })

const { handleSubmit, meta, isSubmitting, resetForm } = useForm<TransactionFormValues>({
    validationSchema: toTypedSchema(transactionFormSchema),
    initialValues: { ...transactionFormInitialValues, ...props.initialValues }
})

const canSubmit = computed(() => meta.value.valid && !isSubmitting.value)

const emit = defineEmits<{ submit: [values: TransactionFormValues] }>()

function onSubmit(values: TransactionFormValues) {
    emit('submit', values)
}

defineExpose({ submit: handleSubmit, resetForm })
</script>

<template>
    <form
        class="transaction-form"
        @submit.prevent="handleSubmit(onSubmit)"
    >
        <TheSelect
            name="accountId"
            label="Счёт"
            placeholder="Выберите счёт"
            :options="accountOptions"
        />
        <TheSelect
            name="categoryId"
            label="Категория"
            placeholder="Выберите категорию"
            :options="categoryOptions"
        />
        <TheInputNumber
            name="amount"
            label="Сумма"
            :precision="2"
        />
        <TheInput
            name="date"
            label="Дата"
            type="date"
        />
        <TheInput
            name="note"
            label="Заметка"
            placeholder="Необязательно"
        />
        <a-button
            type="primary"
            html-type="submit"
            :loading="isSubmitting"
            :disabled="!canSubmit"
        >
            Сохранить
        </a-button>
    </form>
</template>

<style scoped>
.transaction-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>
