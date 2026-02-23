<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed } from 'vue'

import { changePassword } from '@/entities/session/api'

import { message } from '@/shared/lib/message'
import { TheButton, TheInput } from '@/shared/ui'

import { changePasswordFormSchema } from '../model/ChangePasswordForm.schema'
import { changePasswordFormInitialValues } from '../model/ChangePasswordForm.types'

import type { ChangePasswordFormValues } from '../model/ChangePasswordForm.types'

const { handleSubmit, isSubmitting, resetForm } = useForm<ChangePasswordFormValues>({
    validationSchema: toTypedSchema(changePasswordFormSchema),
    initialValues: changePasswordFormInitialValues
})

const canSubmit = computed(() => !isSubmitting.value)

const emit = defineEmits<{ success: [] }>()

async function onSubmit(values: ChangePasswordFormValues) {
    try {
        await changePassword(values.currentPassword, values.newPassword)
        message.success('Пароль изменён')
        resetForm()
        emit('success')
    } catch {
        message.error('Не удалось изменить пароль. Проверьте текущий пароль.')
    }
}

defineExpose({ submit: handleSubmit, resetForm })
</script>

<template>
    <form
        class="change-password-form"
        @submit.prevent="handleSubmit(onSubmit)"
    >
        <TheInput
            name="currentPassword"
            label="Текущий пароль"
            type="password"
            autocomplete="current-password"
        />
        <TheInput
            name="newPassword"
            label="Новый пароль"
            type="password"
            autocomplete="new-password"
        />
        <TheInput
            name="confirmNewPassword"
            label="Повторите новый пароль"
            type="password"
            autocomplete="new-password"
        />
        <TheButton
            type="primary"
            html-type="submit"
            :loading="isSubmitting"
            :disabled="!canSubmit"
        >
            Сменить пароль
        </TheButton>
    </form>
</template>

<style scoped>
.change-password-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>
