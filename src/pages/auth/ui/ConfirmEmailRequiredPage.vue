<script setup lang="ts">
import { ref } from 'vue'

import { resendConfirmEmail } from '@/entities/session/api'

import { ResendConfirmEmailRateLimitError } from '@/shared/api'
import { message } from '@/shared/lib/message'
import { TheButton, ThePageHeader } from '@/shared/ui'

const sending = ref(false)
const rateLimitSeconds = ref<number | null>(null)

async function handleResend() {
    sending.value = true
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
        sending.value = false
    }
}
</script>

<template>
    <div class="confirm-email-required-page">
        <ThePageHeader title="Подтвердите почту" />
        <p class="confirm-email-required-page__text">
            Для продолжения необходимо подтвердить адрес электронной почты. Мы отправили вам письмо со ссылкой —
            перейдите по ней.
        </p>
        <p
            v-if="rateLimitSeconds != null"
            class="confirm-email-required-page__rate-limit"
        >
            Подождите {{ rateLimitSeconds }} сек. перед повторной отправкой.
        </p>
        <TheButton
            type="primary"
            :loading="sending"
            :disabled="rateLimitSeconds != null"
            @click="handleResend"
        >
            Отправить письмо повторно
        </TheButton>
    </div>
</template>

<style scoped>
.confirm-email-required-page {
    padding: 24px;
    max-width: 400px;
    margin: 0 auto;
}

.confirm-email-required-page__text,
.confirm-email-required-page__rate-limit {
    margin-bottom: 16px;
}

.confirm-email-required-page__rate-limit {
    color: var(--color-warning, #faad14);
}
</style>
