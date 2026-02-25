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
import { TheButton, TheForm, TheInput } from '@/shared/ui'

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

function formSubmitHandler(e: SubmitEvent) {
    onSubmit(e)
}
</script>

<template>
    <div
        class="register-form"
        @keydown.enter.prevent="formSubmitHandler($event as unknown as SubmitEvent)"
    >
        <TheForm
            class="register-form__form"
            @submit="formSubmitHandler"
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
                class="register-form__submit"
                type="primary"
                html-type="submit"
                :loading="isSubmitting"
                :disabled="!canSubmit"
                @click.prevent="formSubmitHandler($event as unknown as SubmitEvent)"
            >
                Зарегистрироваться
            </TheButton>
        </TheForm>
    </div>
</template>

<style scoped>
.register-form,
.register-form__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.register-form__submit {
    margin-top: 24px;
}
</style>
