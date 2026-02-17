<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ConfigProvider } from 'ant-design-vue'
import { useTheme } from '@/shared/config/theme/useTheme'
import { AuthLayout } from '@/widgets/layouts/auth'
import { MainLayout } from '@/widgets/layouts/main'

const route = useRoute()
const { themeOverrides } = useTheme()

const layout = computed(() => (route.meta.layout as string) ?? 'main')

const layoutComponent = computed(() => (layout.value === 'auth' ? AuthLayout : MainLayout))
</script>

<template>
    <ConfigProvider :theme="themeOverrides">
        <component :is="layoutComponent">
            <router-view />
        </component>
    </ConfigProvider>
</template>
