<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { login } from '@/entities/session/api'
import { useSessionStore } from '@/entities/session/model/store'

import { toApiError } from '@/shared/api/errors'
import { ROUTE_NAMES, ROUTE_PATHS } from '@/shared/config/router'
import { message } from '@/shared/lib/message'
import { TheButton, TheForm, TheInput, ThePasswordInput } from '@/shared/ui'

import { loginFormSchema } from '../model/LoginForm.schema'
import { loginFormInitialValues } from '../model/LoginForm.types'

import type { LoginFormValues } from '../model/LoginForm.types'

const router = useRouter()
const sessionStore = useSessionStore()

const { handleSubmit, isSubmitting } = useForm<LoginFormValues>({
    validationSchema: toTypedSchema(loginFormSchema),
    initialValues: loginFormInitialValues
})

const canSubmit = computed(() => !isSubmitting.value)

const onSubmit = handleSubmit(async (values) => {
    try {
        const res = await login(values.email, values.password)
        sessionStore.setSession(res.accessToken, res.user, res.sessionId)
        message.success('Вход выполнен')
        router.push(
            res.user.emailConfirmedAt == null
                ? { path: ROUTE_PATHS.CONFIRM_EMAIL_REQUIRED }
                : { name: ROUTE_NAMES.HOME }
        )
    } catch (err) {
        const apiErr = toApiError(err)
        if (apiErr.code === 'UNAUTHORIZED' || apiErr.code === 'INVALID_CREDENTIALS') {
            message.error('Неверный email или пароль')
        } else {
            message.error(apiErr.message)
        }
    }
})

function formSubmitHandler(e: SubmitEvent) {
    onSubmit(e)
}
</script>

<template>
    <div
        class="login-form"
        @keydown.enter.prevent="formSubmitHandler($event as unknown as SubmitEvent)"
    >
        <TheForm
            class="login-form__form"
            @submit="formSubmitHandler"
        >
            <TheInput
                name="email"
                label="Email"
                type="email"
                autocomplete="email"
            />
            <ThePasswordInput
                name="password"
                label="Пароль"
                autocomplete="current-password"
            />
            <TheButton
                class="login-form__submit"
                type="primary"
                html-type="submit"
                :loading="isSubmitting"
                :disabled="!canSubmit"
                @click.prevent="formSubmitHandler($event as unknown as SubmitEvent)"
            >
                Войти
            </TheButton>
        </TheForm>
    </div>
</template>

<style scoped>
.login-form,
.login-form__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.login-form__submit {
    margin-top: 24px;
}
</style>
