<script setup lang="ts">
import { useRouter } from 'vue-router'

import { ChangePasswordForm } from '@/features/auth/change-password'

import { ROUTE_NAMES } from '@/shared/config/router'
import { ThePageHeader } from '@/shared/ui'

const router = useRouter()

function onSuccess() {
    router.push({ name: ROUTE_NAMES.PROFILE })
}
</script>

<template>
    <div class="change-password-page">
        <ThePageHeader title="Смена пароля" />
        <ChangePasswordForm @success="onSuccess" />
    </div>
</template>

<style scoped>
.change-password-page {
    padding: 24px;
    max-width: 400px;
}
</style>
