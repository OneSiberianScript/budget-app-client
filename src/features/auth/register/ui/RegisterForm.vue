<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { register } from '@/entities/session/api'
import { useSessionStore } from '@/entities/session/model/store'

import { toApiError } from '@/shared/api/errors'
import { ROUTE_NAMES, ROUTE_PATHS } from '@/shared/config/router'
import { message } from '@/shared/lib/message'
import { TheButton, TheInput } from '@/shared/ui'

import { registerFormSchema } from '../model/RegisterForm.schema'
import { registerFormInitialValues } from '../model/RegisterForm.types'

import type { RegisterFormValues } from '../model/RegisterForm.types'

const router = useRouter()
const sessionStore = useSessionStore()

const { handleSubmit, isSubmitting } = useForm<RegisterFormValues>({
    validationSchema: toTypedSchema(registerFormSchema),
    initialValues: registerFormInitialValues
})

const canSubmit = computed(() => !isSubmitting.value)

const onSubmit = handleSubmit(async (values) => {
    try {
        const res = await register({
            email: values.email,
            password: values.password,
            firstName: values.firstName,
            lastName: values.lastName
        })
        sessionStore.setSession(res.accessToken, res.user, res.sessionId)
        message.success('Регистрация успешна')
        router.push(
            res.user.emailConfirmedAt == null
                ? { path: ROUTE_PATHS.CONFIRM_EMAIL_REQUIRED }
                : { name: ROUTE_NAMES.HOME }
        )
    } catch (err) {
        const apiErr = toApiError(err)
        if (apiErr.code === 'CONFLICT' || apiErr.message.toLowerCase().includes('email')) {
            message.error('Этот email уже занят')
        } else {
            message.error(apiErr.message)
        }
    }
})
</script>

<template>
    <form
        class="register-form"
        @submit.prevent="onSubmit"
    >
        <TheInput
            name="email"
            label="Email"
            type="email"
            autocomplete="email"
        />
        <TheInput
            name="password"
            label="Пароль"
            type="password"
            autocomplete="new-password"
        />
        <TheInput
            name="firstName"
            label="Имя"
            autocomplete="given-name"
        />
        <TheInput
            name="lastName"
            label="Фамилия"
            autocomplete="family-name"
        />
        <TheButton
            type="primary"
            html-type="submit"
            :loading="isSubmitting"
            :disabled="!canSubmit"
        >
            Зарегистрироваться
        </TheButton>
    </form>
</template>

<style scoped>
.register-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>
