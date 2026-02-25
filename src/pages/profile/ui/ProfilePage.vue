<script setup lang="ts">
import { useRouter } from 'vue-router'

import { BudgetSwitcher } from '@/widgets/budget-switcher'

import { useSessionStore } from '@/entities/session'
import { logout } from '@/entities/session/api'

import { ROUTE_NAMES, ROUTE_PATHS } from '@/shared/config/router'
import type { ThemeId } from '@/shared/config/theme/types'
import { useTheme } from '@/shared/config/theme/useTheme'
import { TheButton, ThePageHeader } from '@/shared/ui'

const router = useRouter()
const sessionStore = useSessionStore()
const { currentTheme, setTheme } = useTheme()

const user = sessionStore.user

const themeOptions: { label: string; value: ThemeId }[] = [
    { label: 'Светлая', value: 'light' },
    { label: 'Тёмная', value: 'dark' }
]

function goToChangePassword() {
    router.push({ name: ROUTE_NAMES.CHANGE_PASSWORD })
}

function goToSessions() {
    router.push({ name: ROUTE_NAMES.SESSIONS })
}

async function handleLogout() {
    try {
        await logout()
    } finally {
        sessionStore.clearSession()
        router.push(ROUTE_PATHS.LOGIN)
    }
}
</script>

<template>
    <div class="profile-page">
        <ThePageHeader title="Профиль" />

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
            <h2 class="profile-page__section-title">Текущий бюджет</h2>
            <p class="profile-page__section-desc">
                Бюджет, с которым вы работаете на дашборде, в разделах «Счета», «Категории», «Планирование» и
                «Транзакции». Список доступных бюджетов — на странице «Бюджеты».
            </p>
            <div class="profile-page__switcher">
                <BudgetSwitcher />
            </div>
        </section>

        <section class="profile-page__section">
            <h2 class="profile-page__section-title">Внешний вид</h2>
            <p class="profile-page__section-desc">Тема оформления приложения.</p>
            <a-radio-group
                :value="currentTheme"
                :options="themeOptions"
                option-type="button"
                button-style="solid"
                @update:value="setTheme"
            />
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

        <section class="profile-page__section">
            <h2 class="profile-page__section-title">Выход</h2>
            <TheButton @click="handleLogout"> Выйти </TheButton>
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
    color: var(--color-text-secondary);
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
    color: var(--color-text-secondary);
}

.profile-page__dl dd {
    margin: 0;
}

.profile-page__switcher {
    max-width: 320px;
}
</style>
