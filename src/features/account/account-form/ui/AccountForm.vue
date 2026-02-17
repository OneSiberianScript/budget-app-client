<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed } from 'vue'

import { TheInput } from '@/shared/ui'

import { accountFormSchema } from '../model/AccountForm.schema'
import { accountFormInitialValues } from '../model/AccountForm.types'

import type { AccountFormValues } from '../model/AccountForm.types'

const props = withDefaults(defineProps<{ initialValues?: Partial<AccountFormValues> }>(), { initialValues: undefined })

const { handleSubmit, meta, isSubmitting, resetForm } = useForm<AccountFormValues>({
    validationSchema: toTypedSchema(accountFormSchema),
    initialValues: { ...accountFormInitialValues, ...props.initialValues }
})

const canSubmit = computed(() => meta.value.valid && !isSubmitting.value)

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
        <TheInput
            name="currency"
            label="Валюта"
            placeholder="RUB"
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
.account-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>
