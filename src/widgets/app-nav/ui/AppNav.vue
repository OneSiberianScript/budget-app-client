<script setup lang="ts">
import { useRoute } from 'vue-router'

import { APP_NAV_ITEMS, type NavItem } from '@/widgets/app-nav/model/nav-config'

const route = useRoute()

function isItemActive(item: NavItem): boolean {
    if (item.name === 'profile') {
        return route.path.startsWith('/profile')
    }
    if (item.name === 'budgets') {
        return route.name === 'budgets' || route.path.startsWith('/budgets')
    }
    return route.name === item.name
}
</script>

<template>
    <nav
        class="app-nav"
        aria-label="Главная навигация"
    >
        <router-link
            v-for="item in APP_NAV_ITEMS"
            :key="item.name"
            :to="{ name: item.name }"
            class="app-nav__item"
            :class="{ 'app-nav__item--active': isItemActive(item) }"
            :aria-label="item.label"
            :aria-current="isItemActive(item) ? 'page' : undefined"
        >
            <component
                :is="item.icon"
                class="app-nav__icon"
            />
            <span class="app-nav__label visually-hidden-mobile">{{ item.label }}</span>
        </router-link>
    </nav>
</template>

<style scoped>
.app-nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    min-height: 56px;
    padding-inline: max(8px, env(safe-area-inset-left)) max(8px, env(safe-area-inset-right));
    padding-bottom: env(safe-area-inset-bottom);
    background: var(--color-bg-container, #fff);
    border-top: 1px solid var(--color-border, #d9d9d9);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
}

.app-nav__item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    min-height: 44px;
    padding: 8px 4px;
    color: var(--color-text-secondary, rgba(0, 0, 0, 0.65));
    text-decoration: none;
    font-size: 0.75rem;
    transition:
        color 0.2s,
        background 0.2s;
}

.app-nav__item:hover {
    color: var(--color-primary, #1677ff);
}

.app-nav__item--active {
    color: var(--color-primary, #1677ff);
}

.app-nav__item--active .app-nav__icon {
    color: var(--color-primary, #1677ff);
}

.app-nav__icon {
    font-size: 1.25rem;
    flex-shrink: 0;
}

.visually-hidden-mobile {
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

@media (min-width: 768px) {
    .app-nav {
        position: static;
        border-top: none;
        border-bottom: 1px solid var(--color-border, #d9d9d9);
        padding-bottom: 0;
        min-height: 48px;
    }

    .app-nav__item {
        flex: 0 1 auto;
        flex-direction: row;
        gap: 8px;
        padding: 12px 16px;
        font-size: 0.875rem;
    }

    .visually-hidden-mobile {
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
