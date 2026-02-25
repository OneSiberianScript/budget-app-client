<script setup lang="ts">
import { ConfigProvider } from 'ant-design-vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import MessageProvider from '@/app/providers/MessageProvider.vue'

import { AuthLayout } from '@/widgets/layouts/auth'
import { MainLayout } from '@/widgets/layouts/main'

import { useSessionStore } from '@/entities/session'

import { useTheme } from '@/shared/config/theme/useTheme'
import { TheSpin } from '@/shared/ui'

const route = useRoute()
const sessionStore = useSessionStore()
const { themeOverrides } = useTheme()

const isRestoringSession = computed(() => sessionStore.restorePromise !== null)

const layout = computed(() => (route.meta.layout as string) ?? 'main')

const layoutComponent = computed(() => (layout.value === 'auth' ? AuthLayout : MainLayout))
</script>

<template>
    <ConfigProvider :theme="themeOverrides">
        <MessageProvider>
            <div
                v-if="isRestoringSession"
                class="app-restore-overlay"
            >
                <TheSpin
                    :spinning="true"
                    size="large"
                />
            </div>
            <component
                :is="layoutComponent"
                v-else
            >
                <router-view />
            </component>
        </MessageProvider>
    </ConfigProvider>
</template>

<style scoped>
.app-restore-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
