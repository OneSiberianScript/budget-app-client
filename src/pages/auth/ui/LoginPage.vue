<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { LoginForm } from '@/features/auth/login'

import { ROUTE_PATHS } from '@/shared/config/router'
</script>

<template>
    <div class="login-page">
        <h1>Вход</h1>
        <LoginForm />
        <p>
            Нет аккаунта?
            <RouterLink :to="ROUTE_PATHS.REGISTER">Зарегистрироваться</RouterLink>
        </p>
    </div>
</template>

<style scoped>
.login-page {
    padding: 24px;
    max-width: 400px;
    margin: 0 auto;
}
.login-page h1 {
    margin-bottom: 24px;
}
.login-page p {
    margin-top: 16px;
}
</style>
