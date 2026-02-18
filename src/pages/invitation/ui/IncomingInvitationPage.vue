<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useBudgetStore } from '@/entities/budget'
import { acceptBudgetInvitation } from '@/entities/budget-invitation/api'
import { useSessionStore } from '@/entities/session'

import { ROUTE_NAMES, ROUTE_PATHS } from '@/shared/config/router'
import { message } from '@/shared/lib/message'
import { TheButton, ThePageHeader } from '@/shared/ui'

const route = useRoute()
const router = useRouter()
const budgetStore = useBudgetStore()
const sessionStore = useSessionStore()

const loading = ref(false)
const success = ref(false)
const errorMessage = ref('')

const token = computed(() => (route.query.token as string) ?? '')

async function accept() {
    if (!token.value) return
    loading.value = true
    errorMessage.value = ''
    try {
        const { budgetId } = await acceptBudgetInvitation(token.value)
        success.value = true
        message.success('Вы присоединились к бюджету')
        if (sessionStore.isAuthenticated) {
            budgetStore.setCurrentBudget(budgetId, null)
            router.push({ name: ROUTE_NAMES.HOME })
        } else {
            router.push({ path: ROUTE_PATHS.LOGIN, query: { redirect: ROUTE_PATHS.HOME } })
        }
    } catch {
        success.value = false
        errorMessage.value = 'Не удалось принять приглашение. Ссылка могла устареть.'
    } finally {
        loading.value = false
    }
}

function goToLogin() {
    router.push({ name: ROUTE_NAMES.LOGIN })
}

onMounted(() => {})
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

        <template v-else-if="loading && !success">
            <p class="incoming-invitation-page__loading">Обработка…</p>
        </template>

        <template v-else-if="success">
            <p class="incoming-invitation-page__success">Вы успешно присоединились к бюджету. Перенаправление…</p>
        </template>

        <template v-else>
            <p class="incoming-invitation-page__text">
                Вам отправили приглашение в бюджет. Нажмите «Принять», чтобы присоединиться.
            </p>
            <p
                v-if="errorMessage"
                class="incoming-invitation-page__error"
            >
                {{ errorMessage }}
            </p>
            <div class="incoming-invitation-page__actions">
                <TheButton
                    type="primary"
                    :loading="loading"
                    :disabled="loading"
                    @click="accept"
                >
                    Принять
                </TheButton>
                <TheButton
                    v-if="!sessionStore.isAuthenticated"
                    @click="goToLogin"
                >
                    Войти в аккаунт
                </TheButton>
            </div>
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
.incoming-invitation-page__loading,
.incoming-invitation-page__success,
.incoming-invitation-page__error {
    margin-bottom: 16px;
}

.incoming-invitation-page__error {
    color: var(--color-error, #ff4d4f);
}

.incoming-invitation-page__actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}
</style>
