<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { RegisterForm } from '@/features/auth/register'

import { ROUTE_PATHS } from '@/shared/config/router'
</script>

<template>
    <div class="register-page">
        <h1>Регистрация</h1>
        <RegisterForm />
        <p>
            Уже есть аккаунт?
            <RouterLink :to="ROUTE_PATHS.LOGIN">Войти</RouterLink>
        </p>
    </div>
</template>

<style scoped>
.register-page {
    padding: 24px;
    max-width: 400px;
    margin: 0 auto;
}
.register-page h1 {
    margin-bottom: 24px;
}
.register-page p {
    margin-top: 16px;
}
</style>
