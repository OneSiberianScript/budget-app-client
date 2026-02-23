<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed } from 'vue'

import { TheButton, TheForm, TheInput, TheSelect } from '@/shared/ui'

import { accountFormSchema } from '../model/AccountForm.schema'
import { accountFormInitialValues } from '../model/AccountForm.types'

import type { AccountFormValues } from '../model/AccountForm.types'

const props = withDefaults(defineProps<{ initialValues?: Partial<AccountFormValues> }>(), { initialValues: undefined })

const { handleSubmit, isSubmitting, resetForm } = useForm<AccountFormValues>({
    validationSchema: toTypedSchema(accountFormSchema),
    initialValues: { ...accountFormInitialValues, ...props.initialValues }
})

const canSubmit = computed(() => !isSubmitting.value)

const accountTypeOptions = [
    { label: 'Счёт', value: 'account' },
    { label: 'Карта', value: 'card' },
    { label: 'Наличные', value: 'cash' }
]

const emit = defineEmits<{ submit: [values: AccountFormValues] }>()

function onSubmit(values: AccountFormValues) {
    emit('submit', values)
}

function formSubmitHandler(e: SubmitEvent) {
    handleSubmit(onSubmit)(e)
}

defineExpose({ submit: handleSubmit, resetForm })
</script>

<template>
    <div
        class="account-form"
        @keydown.enter.prevent="formSubmitHandler($event as unknown as SubmitEvent)"
    >
        <TheForm
            class="account-form__form"
            @submit="formSubmitHandler"
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
                @click.prevent="formSubmitHandler($event as unknown as SubmitEvent)"
            >
                Сохранить
            </TheButton>
        </TheForm>
    </div>
</template>

<style scoped>
.account-form,
.account-form__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>
