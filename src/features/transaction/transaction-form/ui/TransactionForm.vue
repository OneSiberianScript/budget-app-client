<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed } from 'vue'

import { TheButton, TheInput, TheInputNumber, TheSelect } from '@/shared/ui'

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

const { handleSubmit, isSubmitting, resetForm } = useForm<TransactionFormValues>({
    validationSchema: toTypedSchema(transactionFormSchema),
    initialValues: { ...transactionFormInitialValues, ...props.initialValues }
})

const canSubmit = computed(() => !isSubmitting.value)

const typeOptions = [
    { label: 'Расход', value: 'expense' },
    { label: 'Доход', value: 'income' },
    { label: 'Перевод', value: 'transfer' }
]

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
            name="type"
            label="Тип"
            placeholder="Выберите тип"
            :options="typeOptions"
        />
        <TheSelect
            name="debitAccountId"
            label="Счёт списания"
            placeholder="Для расхода или перевода"
            :options="accountOptions"
        />
        <TheSelect
            name="creditAccountId"
            label="Счёт зачисления"
            placeholder="Для дохода или перевода"
            :options="accountOptions"
        />
        <TheSelect
            name="categoryId"
            label="Категория"
            placeholder="Выберите категорию (необязательно)"
            :options="categoryOptions"
        />
        <TheInputNumber
            name="amount"
            label="Сумма"
            :precision="2"
        />
        <TheInput
            name="occurredAt"
            label="Дата"
            type="date"
        />
        <TheInput
            name="description"
            label="Описание"
            placeholder="Необязательно"
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
.transaction-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>
