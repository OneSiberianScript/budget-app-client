<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { message } from 'ant-design-vue'
import { useForm } from 'vee-validate'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { login } from '@/entities/session/api'
import { useSessionStore } from '@/entities/session/model/store'

import { toApiError } from '@/shared/api/errors'
import { ROUTE_NAMES } from '@/shared/config/router'
import { TheInput } from '@/shared/ui'

import { loginFormSchema } from '../model/LoginForm.schema'
import { loginFormInitialValues } from '../model/LoginForm.types'

import type { LoginFormValues } from '../model/LoginForm.types'

const router = useRouter()
const sessionStore = useSessionStore()

const { handleSubmit, meta, isSubmitting } = useForm<LoginFormValues>({
    validationSchema: toTypedSchema(loginFormSchema),
    initialValues: loginFormInitialValues
})

const canSubmit = computed(() => meta.value.valid && !isSubmitting.value)

const onSubmit = handleSubmit(async (values) => {
    try {
        const res = await login(values.email, values.password)
        sessionStore.setSession(res.accessToken, res.user)
        message.success('Вход выполнен')
        router.push({ name: ROUTE_NAMES.HOME })
    } catch (err) {
        const apiErr = toApiError(err)
        if (apiErr.code === 'UNAUTHORIZED' || apiErr.code === 'INVALID_CREDENTIALS') {
            message.error('Неверный email или пароль')
        } else {
            message.error(apiErr.message)
        }
    }
})
</script>

<template>
    <form
        class="login-form"
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
            autocomplete="current-password"
        />
        <a-button
            type="primary"
            html-type="submit"
            :loading="isSubmitting"
            :disabled="!canSubmit"
        >
            Войти
        </a-button>
    </form>
</template>

<style scoped>
.login-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>
