<script setup lang="ts">
import { useRouter } from 'vue-router'

import { useSessionStore } from '@/entities/session'

import { ROUTE_NAMES } from '@/shared/config/router'
import { TheButton } from '@/shared/ui'

const router = useRouter()
const sessionStore = useSessionStore()

const user = sessionStore.user

function goToChangePassword() {
    router.push({ name: ROUTE_NAMES.CHANGE_PASSWORD })
}

function goToSessions() {
    router.push({ name: ROUTE_NAMES.SESSIONS })
}
</script>

<template>
    <div class="profile-page">
        <h1 class="profile-page__title">Профиль</h1>

        <section class="profile-page__section">
            <h2 class="profile-page__section-title">Данные пользователя</h2>
            <dl class="profile-page__dl">
                <dt>Email</dt>
                <dd>{{ user?.email }}</dd>
                <dt>Имя</dt>
                <dd>{{ user?.firstName ?? '—' }}</dd>
                <dt>Фамилия</dt>
                <dd>{{ user?.lastName ?? '—' }}</dd>
            </dl>
        </section>

        <section class="profile-page__section">
            <h2 class="profile-page__section-title">Безопасность</h2>
            <TheButton
                type="primary"
                @click="goToChangePassword"
            >
                Сменить пароль
            </TheButton>
        </section>

        <section class="profile-page__section">
            <h2 class="profile-page__section-title">Сессии</h2>
            <p class="profile-page__section-desc">Управление активными сессиями (устройства, где выполнен вход).</p>
            <TheButton @click="goToSessions"> Управление сессиями </TheButton>
        </section>

        <section class="profile-page__section">
            <h2 class="profile-page__section-title">Доступы к бюджетам</h2>
            <p class="profile-page__section-desc">
                Список бюджетов, к которым у вас есть доступ, и приглашения — на страницах «Бюджеты» и в настройках
                конкретного бюджета.
            </p>
        </section>
    </div>
</template>

<style scoped>
.profile-page {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-height: 0;
}

.profile-page__title {
    margin: 0;
    font-size: 1.25rem;
}

.profile-page__section {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.profile-page__section-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
}

.profile-page__section-desc {
    margin: 0;
    color: var(--color-text-secondary, #666);
    font-size: 0.875rem;
}

.profile-page__dl {
    margin: 0;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 8px 24px;
}

.profile-page__dl dt {
    font-weight: 500;
    color: var(--color-text-secondary, #666);
}

.profile-page__dl dd {
    margin: 0;
}
</style>
