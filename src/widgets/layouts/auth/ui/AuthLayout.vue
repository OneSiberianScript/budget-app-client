<script setup lang="ts">
import { computed } from 'vue'

import { useTheme } from '@/shared/config/theme/useTheme'

const { currentTheme } = useTheme()

const logoSrc = computed(() => {
    const name = currentTheme.value === 'dark' ? 'Logo Dark.svg' : 'Logo Light.svg'
    return `/logo/${encodeURI(name)}`
})
</script>

<template>
    <div class="auth-layout">
        <main class="auth-layout__content">
            <div class="auth-layout__card">
                <img
                    :src="logoSrc"
                    alt="Budget App"
                    class="auth-layout__logo"
                />
                <slot />
            </div>
        </main>
    </div>
</template>

<style scoped>
.auth-layout {
    height: 100dvh;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
}
.auth-layout__content {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    -webkit-overflow-scrolling: touch;
    padding-inline: max(16px, env(safe-area-inset-left)) max(16px, env(safe-area-inset-right));
    display: flex;
    align-items: center;
    justify-content: center;
}
.auth-layout__card {
    max-width: 400px;
    width: 100%;
    padding: 24px;
}
.auth-layout__logo {
    display: block;
    width: 100%;
    margin-bottom: 24px;
}
</style>
