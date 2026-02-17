<script setup lang="ts">
import { ConfigProvider } from 'ant-design-vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import MessageProvider from '@/app/providers/MessageProvider.vue'

import { AuthLayout } from '@/widgets/layouts/auth'
import { MainLayout } from '@/widgets/layouts/main'

import { useTheme } from '@/shared/config/theme/useTheme'

const route = useRoute()
const { themeOverrides } = useTheme()

const layout = computed(() => (route.meta.layout as string) ?? 'main')

const layoutComponent = computed(() => (layout.value === 'auth' ? AuthLayout : MainLayout))
</script>

<template>
    <ConfigProvider :theme="themeOverrides">
        <MessageProvider>
            <component :is="layoutComponent">
                <router-view />
            </component>
        </MessageProvider>
    </ConfigProvider>
</template>
