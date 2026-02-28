<script setup lang="ts">
import { Person24Regular } from '@vicons/fluent'
import { computed } from 'vue'

import { AppNav } from '@/widgets/app-nav'

import { useBudgetStore } from '@/entities/budget'
import { useSessionStore } from '@/entities/session/model/store'

import { ROUTE_NAMES } from '@/shared/config/router'
import { useTheme } from '@/shared/config/theme/useTheme'
import { TheSpin } from '@/shared/ui'

const sessionStore = useSessionStore()
const budgetStore = useBudgetStore()
const { currentTheme } = useTheme()

const logoSrc = computed(() => {
    const name = currentTheme.value === 'dark' ? 'Logo Dark.svg' : 'Logo Light.svg'
    return `/logo/${encodeURI(name)}`
})
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
            <router-link
                v-if="sessionStore.isAuthenticated"
                :to="{ name: ROUTE_NAMES.PROFILE }"
                class="main-layout__profile-link"
                aria-label="Профиль"
            >
                <Person24Regular class="main-layout__profile-icon" />
                <span class="main-layout__profile-label">Профиль</span>
            </router-link>
        </header>
        <main class="main-layout__content">
            <div
                v-if="!budgetStore.budgetsLoadedOnce"
                class="main-layout__loader"
            >
                <TheSpin
                    :spinning="true"
                    size="large"
                />
            </div>
            <slot v-else />
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
    justify-content: space-between;
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

.main-layout__profile-link {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-width: 32px;
    height: 32px;
    padding: 4px;
    color: var(--color-text);
    text-decoration: none;
    font-size: 14px;
    line-height: 1.5715;
    background: var(--color-bg-container);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
}

.main-layout__profile-icon {
    width: 1.5rem;
    height: 1.5rem;
    flex-shrink: 0;
    color: currentColor;
}

.main-layout__profile-label {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.main-layout__profile-link:hover {
    color: var(--color-primary-hover);
    border-color: var(--color-primary-hover);
    background: var(--color-primary-bg-hover);
}

.main-layout__content {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    -webkit-overflow-scrolling: touch;
    padding-bottom: calc(84px + env(safe-area-inset-bottom));
    background: var(--color-bg-primary);
}

.main-layout__loader {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
}

@media (min-width: 768px) {
    .main-layout__content {
        padding-bottom: env(safe-area-inset-bottom);
    }
    .main-layout__header {
        justify-content: none;
    }
    .main-layout__profile-link {
        padding: 4px 15px;
    }
    .main-layout__profile-label {
        position: static;
        width: auto;
        height: auto;
        padding: 0;
        margin: 0;
        overflow: visible;
        clip: auto;
        white-space: normal;
        border: 0;
    }
}
</style>
