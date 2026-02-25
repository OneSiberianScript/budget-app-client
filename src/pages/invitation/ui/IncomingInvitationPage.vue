<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { ROUTE_NAMES } from '@/shared/config/router'
import { TheButton, ThePageHeader } from '@/shared/ui'

const route = useRoute()
const router = useRouter()

const token = computed(() => (route.query.token as string) ?? '')

/** Приём приглашения по токену в openapi.yaml не описан — эндпоинт accept отсутствует в спецификации. */
function goToLogin() {
    router.push({ name: ROUTE_NAMES.LOGIN })
}
</script>

<template>
    <div class="incoming-invitation-page">
        <ThePageHeader title="Приглашение в бюджет" />

        <template v-if="!token">
            <p class="incoming-invitation-page__error">Ссылка приглашения не указана.</p>
            <TheButton
                type="primary"
                @click="goToLogin"
            >
                Перейти к входу
            </TheButton>
        </template>

        <template v-else>
            <p class="incoming-invitation-page__text">
                Приём приглашения по ссылке в текущей версии API не поддерживается. Войдите в аккаунт и примите
                приглашение из списка бюджетов.
            </p>
            <TheButton
                type="primary"
                @click="goToLogin"
            >
                Войти в аккаунт
            </TheButton>
        </template>
    </div>
</template>

<style scoped>
.incoming-invitation-page {
    padding: 24px;
    max-width: 400px;
    margin: 0 auto;
}

.incoming-invitation-page__text,
.incoming-invitation-page__error {
    margin-bottom: 16px;
}

.incoming-invitation-page__error {
    color: var(--color-error);
}
</style>
