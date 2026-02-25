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
.register-page h1 {
    margin-bottom: 24px;
    text-align: center;
}
.register-page p {
    margin-top: 16px;
    text-align: center;
}
</style>
