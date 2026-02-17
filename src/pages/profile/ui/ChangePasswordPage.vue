<script setup lang="ts">
import { useRouter } from 'vue-router'

import { ChangePasswordForm } from '@/features/auth/change-password'

import { ROUTE_NAMES } from '@/shared/config/router'

const router = useRouter()

function onSuccess() {
    router.push({ name: ROUTE_NAMES.PROFILE })
}
</script>

<template>
    <div class="change-password-page">
        <h1 class="change-password-page__title">Смена пароля</h1>
        <ChangePasswordForm @success="onSuccess" />
    </div>
</template>

<style scoped>
.change-password-page {
    padding: 24px;
    max-width: 400px;
}

.change-password-page__title {
    margin: 0 0 24px;
    font-size: 1.25rem;
}
</style>
