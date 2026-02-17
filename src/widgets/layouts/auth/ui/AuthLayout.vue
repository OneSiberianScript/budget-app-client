<script setup lang="ts"></script>

<template>
    <div class="auth-layout">
        <main class="auth-layout__content">
            <slot />
        </main>
    </div>
</template>

<style scoped>
.auth-layout {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
}
.auth-layout__content {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
}
</style>
