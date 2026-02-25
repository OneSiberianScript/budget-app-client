<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { AppNav } from '@/widgets/app-nav'

import { logout } from '@/entities/session/api'
import { useSessionStore } from '@/entities/session/model/store'

import { ROUTE_PATHS } from '@/shared/config/router'
import { useTheme } from '@/shared/config/theme/useTheme'
import { TheButton } from '@/shared/ui'

const router = useRouter()
const sessionStore = useSessionStore()
const { currentTheme } = useTheme()

const logoSrc = computed(() => {
    const name = currentTheme.value === 'dark' ? 'Logo Dark.svg' : 'Logo Light.svg'
    return `/logo/${encodeURI(name)}`
})

async function handleLogout() {
    await logout()
    router.push(ROUTE_PATHS.LOGIN)
}
</script>

<template>
    <div class="main-layout">
        <header class="main-layout__header">
            <img
                :src="logoSrc"
                alt="Budget App"
                class="main-layout__logo"
            />
            <AppNav class="main-layout__nav" />
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
    height: 100dvh;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
}
.main-layout__header {
    padding: 16px max(24px, env(safe-area-inset-right)) 16px max(24px, env(safe-area-inset-left));
    display: flex;
    align-items: center;
    gap: 16px;
    background: var(--color-bg-primary);
}

.main-layout__nav {
    flex: 1;
    min-width: 0;
}

.main-layout__logo {
    height: 32px;
    width: auto;
    display: block;
}
.main-layout__content {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    -webkit-overflow-scrolling: touch;
    padding-bottom: calc(56px + env(safe-area-inset-bottom));
    background: var(--color-bg-primary);
}

@media (min-width: 768px) {
    .main-layout__content {
        padding-bottom: env(safe-area-inset-bottom);
    }
}
</style>
