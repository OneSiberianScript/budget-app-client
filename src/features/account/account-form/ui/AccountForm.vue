<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed } from 'vue'

import { getBankSelectOptions, type BankSelectOption } from '@/entities/account'

import { TheButton, TheForm, TheInput, TheSelect, type Option as SelectOption } from '@/shared/ui'

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

const bankOptions = getBankSelectOptions() as SelectOption[]

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
            <TheSelect
                name="bank"
                label="Банк"
                placeholder="Выберите банк"
                :options="bankOptions"
            >
                <template #option="{ option }">
                    <img
                        v-if="(option as BankSelectOption).logoUrl"
                        :src="(option as BankSelectOption).logoUrl!"
                        :alt="(option as BankSelectOption).label"
                        class="account-form__bank-logo"
                    />
                    <span>{{ (option as BankSelectOption).label }}</span>
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
.account-form,
.account-form__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.account-form__bank-logo {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    vertical-align: middle;
    object-fit: contain;
}
</style>
