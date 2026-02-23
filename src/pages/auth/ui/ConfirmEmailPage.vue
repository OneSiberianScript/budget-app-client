<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { confirmEmail, resendConfirmEmail } from '@/entities/session/api'

import { ResendConfirmEmailRateLimitError } from '@/shared/api'
import { ROUTE_NAMES, ROUTE_PATHS } from '@/shared/config/router'
import { message } from '@/shared/lib/message'
import { TheButton, ThePageHeader } from '@/shared/ui'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const success = ref(false)
const errorMessage = ref('')
const resendSending = ref(false)
const rateLimitSeconds = ref<number | null>(null)

const token = computed(() => (route.query.token as string) ?? '')

onMounted(async () => {
    if (!token.value) {
        errorMessage.value = 'Токен подтверждения не указан.'
        loading.value = false
        return
    }
    try {
        await confirmEmail(token.value)
        success.value = true
        message.success('Email подтверждён')
        setTimeout(() => {
            router.push({ path: ROUTE_PATHS.LOGIN })
        }, 2000)
    } catch {
        success.value = false
        errorMessage.value = 'Ссылка недействительна или истекла.'
    } finally {
        loading.value = false
    }
})

function goToLogin() {
    router.push({ name: ROUTE_NAMES.LOGIN })
}

async function handleResend() {
    resendSending.value = true
    rateLimitSeconds.value = null
    try {
        await resendConfirmEmail()
        message.success('Письмо отправлено. Проверьте почту.')
    } catch (err) {
        if (err instanceof ResendConfirmEmailRateLimitError && err.retryAfter != null) {
            rateLimitSeconds.value = err.retryAfter
        } else {
            message.error('Не удалось отправить письмо. Попробуйте позже.')
        }
    } finally {
        resendSending.value = false
    }
}
</script>

<template>
    <div class="confirm-email-page">
        <ThePageHeader title="Подтверждение email" />
        <div
            v-if="loading"
            class="confirm-email-page__loading"
        >
            Проверка...
        </div>
        <template v-else>
            <p
                v-if="success"
                class="confirm-email-page__success"
            >
                Email успешно подтверждён. Перенаправление на страницу входа...
            </p>
            <template v-else>
                <p class="confirm-email-page__error">
                    {{ errorMessage }}
                </p>
                <p
                    v-if="rateLimitSeconds != null"
                    class="confirm-email-page__rate-limit"
                >
                    Подождите {{ rateLimitSeconds }} сек. перед повторной отправкой.
                </p>
                <div class="confirm-email-page__actions">
                    <TheButton
                        type="primary"
                        :loading="resendSending"
                        :disabled="rateLimitSeconds != null"
                        @click="handleResend"
                    >
                        Отправить письмо повторно
                    </TheButton>
                    <TheButton @click="goToLogin"> Перейти к входу </TheButton>
                </div>
            </template>
        </template>
    </div>
</template>

<style scoped>
.confirm-email-page {
    padding: 24px;
    max-width: 400px;
    margin: 0 auto;
}

.confirm-email-page__loading,
.confirm-email-page__success,
.confirm-email-page__error,
.confirm-email-page__rate-limit {
    margin-bottom: 16px;
}

.confirm-email-page__error {
    color: var(--color-error, #ff4d4f);
}

.confirm-email-page__rate-limit {
    color: var(--color-warning, #faad14);
}

.confirm-email-page__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}
</style>
