<script setup lang="ts">
import { useRouter } from 'vue-router'

import { AppNav } from '@/widgets/app-nav'
import { BudgetSwitcher } from '@/widgets/budget-switcher'

import { logout } from '@/entities/session/api'
import { useSessionStore } from '@/entities/session/model/store'

import { ROUTE_PATHS } from '@/shared/config/router'
import { TheButton } from '@/shared/ui'

const router = useRouter()
const sessionStore = useSessionStore()

async function handleLogout() {
    await logout()
    router.push(ROUTE_PATHS.LOGIN)
}
</script>

<template>
    <div class="main-layout">
        <AppNav />
        <header class="main-layout__header">
            <span>Budget App</span>
            <BudgetSwitcher
                v-if="sessionStore.isAuthenticated"
                class="main-layout__switcher"
            />
            <TheButton
                v-if="sessionStore.isAuthenticated"
                @click="handleLogout"
            >
                Выйти
            </TheButton>
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
    padding-bottom: calc(56px + env(safe-area-inset-bottom));
}

@media (min-width: 768px) {
    .main-layout__content {
        padding-bottom: 0;
    }
}
</style>
