<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { getInvitationByToken, useBudgetInvitationStore } from '@/entities/budget-invitation'
import { useSessionStore } from '@/entities/session'

import { toApiError } from '@/shared/api/errors'
import { ROUTE_NAMES, ROUTE_PATHS } from '@/shared/config/router'
import type { BudgetInvitationWithBudget } from '@/shared/types'
import { TheButton, ThePageHeader, TheSpin } from '@/shared/ui'

type PageState = 'init' | 'no-token' | 'unauthenticated' | 'loading' | 'loaded' | 'error' | 'done'

const roleLabels: Record<string, string> = {
    viewer: 'Наблюдатель',
    editor: 'Редактор'
}

const errorMessages: Record<string, string> = {
    INVITATION_EXPIRED: 'Ссылка устарела — попросите пригласить вас заново.',
    INVITATION_EMAIL_MISMATCH: 'Это приглашение предназначено для другого email.',
    INVITATION_NOT_PENDING: 'Приглашение уже использовано.',
    BUDGET_INVITATION_NOT_FOUND: 'Приглашение не найдено.'
}

const route = useRoute()
const router = useRouter()
const sessionStore = useSessionStore()
const invitationStore = useBudgetInvitationStore()

const state = ref<PageState>('init')
const invitation = ref<BudgetInvitationWithBudget | null>(null)
const errorCode = ref<string | null>(null)
const isAccepting = ref(false)
const isRejecting = ref(false)

const token = computed(() => (route.query.token as string) || '')

const errorMessage = computed(() => {
    if (!errorCode.value) return 'Произошла ошибка.'
    return errorMessages[errorCode.value] ?? 'Произошла ошибка.'
})

onMounted(async () => {
    if (sessionStore.restorePromise) {
        await sessionStore.restorePromise
    }

    if (!token.value) {
        state.value = 'no-token'
        return
    }

    if (!sessionStore.isAuthenticated) {
        state.value = 'unauthenticated'
        return
    }

    state.value = 'loading'
    try {
        invitation.value = await getInvitationByToken(token.value)
        state.value = 'loaded'
    } catch (err) {
        const apiErr = toApiError(err)
        errorCode.value = apiErr.code
        state.value = 'error'
    }
})

async function handleAccept() {
    if (!invitation.value) return
    isAccepting.value = true
    try {
        await invitationStore.acceptInvitation(invitation.value.id)
        state.value = 'done'
        router.push({ name: ROUTE_NAMES.HOME })
    } catch (err) {
        const apiErr = toApiError(err)
        if (apiErr.code === 'ALREADY_BUDGET_MEMBER') {
            // бэкенд уже добавил — трактуем как успех
            router.push({ name: ROUTE_NAMES.HOME })
            return
        }
        errorCode.value = apiErr.code
        state.value = 'error'
    } finally {
        isAccepting.value = false
    }
}

async function handleReject() {
    if (!invitation.value) return
    isRejecting.value = true
    try {
        await invitationStore.rejectInvitation(invitation.value.id)
        router.push({ name: ROUTE_NAMES.HOME })
    } catch (err) {
        const apiErr = toApiError(err)
        errorCode.value = apiErr.code
        state.value = 'error'
    } finally {
        isRejecting.value = false
    }
}

function goToLogin() {
    router.push({ path: ROUTE_PATHS.LOGIN, query: { token: token.value } })
}

function goToRegister() {
    router.push({ path: ROUTE_PATHS.REGISTER, query: { token: token.value } })
}
</script>

<template>
    <div class="incoming-invitation-page">
        <ThePageHeader title="Приглашение в бюджет" />

        <TheSpin
            v-if="state === 'init' || state === 'loading'"
            :spinning="true"
            class="incoming-invitation-page__spin"
        />

        <div
            v-else-if="state === 'no-token'"
            class="incoming-invitation-page__message"
        >
            <p class="incoming-invitation-page__error">Ссылка приглашения недействительна.</p>
        </div>

        <div
            v-else-if="state === 'unauthenticated'"
            class="incoming-invitation-page__message"
        >
            <p>Войдите или зарегистрируйтесь, чтобы принять приглашение.</p>
            <div class="incoming-invitation-page__actions">
                <TheButton
                    type="primary"
                    @click="goToLogin"
                >
                    Войти
                </TheButton>
                <TheButton @click="goToRegister"> Зарегистрироваться </TheButton>
            </div>
        </div>

        <div
            v-else-if="state === 'loaded' && invitation"
            class="incoming-invitation-page__card"
        >
            <p class="incoming-invitation-page__desc">
                Вас приглашают в бюджет
                <strong v-if="invitation.budget?.name">{{ invitation.budget.name }}</strong>
                с ролью
                <strong>{{ roleLabels[invitation.role] ?? invitation.role }}</strong
                >.
            </p>
            <p class="incoming-invitation-page__email">
                Email: <strong>{{ invitation.email }}</strong>
            </p>
            <div class="incoming-invitation-page__actions">
                <TheButton
                    type="primary"
                    :loading="isAccepting"
                    @click="handleAccept"
                >
                    Принять
                </TheButton>
                <TheButton
                    :loading="isRejecting"
                    @click="handleReject"
                >
                    Отклонить
                </TheButton>
            </div>
        </div>

        <div
            v-else-if="state === 'error'"
            class="incoming-invitation-page__message"
        >
            <p class="incoming-invitation-page__error">{{ errorMessage }}</p>
        </div>
    </div>
</template>

<style scoped>
.incoming-invitation-page {
    padding: 24px;
    max-width: 440px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.incoming-invitation-page__spin {
    min-height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.incoming-invitation-page__message,
.incoming-invitation-page__card {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.incoming-invitation-page__error {
    color: var(--color-error);
    margin: 0;
}

.incoming-invitation-page__desc,
.incoming-invitation-page__email {
    margin: 0;
}

.incoming-invitation-page__actions {
    display: flex;
    gap: 12px;
}
</style>
