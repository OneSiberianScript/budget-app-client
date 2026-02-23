<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed } from 'vue'

import { TheButton, TheInput, TheSelect } from '@/shared/ui'

import { accountFormSchema } from '../model/AccountForm.schema'
import { accountFormInitialValues } from '../model/AccountForm.types'

import type { AccountFormValues } from '../model/AccountForm.types'

const props = withDefaults(defineProps<{ initialValues?: Partial<AccountFormValues> }>(), { initialValues: undefined })

const { handleSubmit, meta, isSubmitting, resetForm } = useForm<AccountFormValues>({
    validationSchema: toTypedSchema(accountFormSchema),
    initialValues: { ...accountFormInitialValues, ...props.initialValues }
})

const canSubmit = computed(() => meta.value.valid && !isSubmitting.value)

const accountTypeOptions = [
    { label: 'Счёт', value: 'account' },
    { label: 'Карта', value: 'card' },
    { label: 'Наличные', value: 'cash' }
]

const emit = defineEmits<{ submit: [values: AccountFormValues] }>()

function onSubmit(values: AccountFormValues) {
    emit('submit', values)
}

defineExpose({ submit: handleSubmit, resetForm })
</script>

<template>
    <form
        class="account-form"
        @submit.prevent="handleSubmit(onSubmit)"
    >
        <TheInput
            name="name"
            label="Название"
            placeholder="Счёт"
        />
        <TheSelect
            name="type"
            label="Тип счёта"
            placeholder="Выберите тип"
            :options="accountTypeOptions"
        />
        <TheInput
            name="initialBalance"
            label="Начальный баланс"
            placeholder="0"
        />
        <TheInput
            name="bank"
            label="Банк"
            placeholder="Название банка (необязательно)"
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
.account-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>
