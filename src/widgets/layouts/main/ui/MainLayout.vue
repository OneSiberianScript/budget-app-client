<script setup lang="ts">
import { useRouter } from 'vue-router'

import { BudgetSwitcher } from '@/widgets/budget-switcher'

import { logout } from '@/entities/session/api'
import { useSessionStore } from '@/entities/session/model/store'

import { ROUTE_PATHS } from '@/shared/config/router'

const router = useRouter()
const sessionStore = useSessionStore()

async function handleLogout() {
    await logout()
    router.push(ROUTE_PATHS.LOGIN)
}
</script>

<template>
    <div class="main-layout">
        <header class="main-layout__header">
            <span>Budget App</span>
            <BudgetSwitcher
                v-if="sessionStore.isAuthenticated"
                class="main-layout__switcher"
            />
            <a-button
                v-if="sessionStore.isAuthenticated"
                @click="handleLogout"
                >Выйти</a-button
            >
        </header>
        <main class="main-layout__content">
            <slot />
        </main>
    </div>
</template>

<style scoped>
.main-layout {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
}
.main-layout__header {
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--color-border, #d9d9d9);
}
.main-layout__content {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
}
</style>
