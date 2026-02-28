<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed } from 'vue'

import { useSessionStore } from '@/entities/session'
import { changePassword } from '@/entities/session/api'

import { message } from '@/shared/lib/message'
import { TheButton, TheForm, ThePasswordInput } from '@/shared/ui'

import { changePasswordFormSchema } from '../model/ChangePasswordForm.schema'
import { changePasswordFormInitialValues } from '../model/ChangePasswordForm.types'

import type { ChangePasswordFormValues } from '../model/ChangePasswordForm.types'

const sessionStore = useSessionStore()
const { handleSubmit, isSubmitting, resetForm } = useForm<ChangePasswordFormValues>({
    validationSchema: toTypedSchema(changePasswordFormSchema),
    initialValues: changePasswordFormInitialValues
})

const canSubmit = computed(() => !isSubmitting.value)

const emit = defineEmits<{ success: [] }>()

async function onSubmit(values: ChangePasswordFormValues) {
    try {
        const res = await changePassword(values.currentPassword, values.newPassword)
        sessionStore.setAccessToken(res.accessToken, res.sessionId)
        message.success('Пароль изменён')
        resetForm()
        emit('success')
    } catch {
        message.error('Не удалось изменить пароль. Проверьте текущий пароль.')
    }
}

function formSubmitHandler(e: SubmitEvent) {
    handleSubmit(onSubmit)(e)
}

defineExpose({ submit: handleSubmit, resetForm })
</script>

<template>
    <div
        class="change-password-form"
        @keydown.enter.prevent="formSubmitHandler($event as unknown as SubmitEvent)"
    >
        <TheForm
            class="change-password-form__form"
            @submit="formSubmitHandler"
        >
            <ThePasswordInput
                name="currentPassword"
                label="Текущий пароль"
                autocomplete="current-password"
            />
            <ThePasswordInput
                name="newPassword"
                label="Новый пароль"
                autocomplete="new-password"
            />
            <ThePasswordInput
                name="confirmNewPassword"
                label="Повторите новый пароль"
                autocomplete="new-password"
            />
            <TheButton
                type="primary"
                html-type="submit"
                :loading="isSubmitting"
                :disabled="!canSubmit"
                @click.prevent="formSubmitHandler($event as unknown as SubmitEvent)"
            >
                Сменить пароль
            </TheButton>
        </TheForm>
    </div>
</template>

<style scoped>
.change-password-form,
.change-password-form__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>
