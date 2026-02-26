<script setup lang="ts">
import { TheAlert, TheEmpty, TheSpin } from '@/shared/ui'

/**
 * Обёртка контента страницы: лоадер пока идёт загрузка; «Выберите бюджет» только при !loading && !hasBudget;
 * ошибка при !loading && hasBudget && error; иначе слот с контентом.
 * Исключает показ сообщения об отсутствии контента до завершения загрузки.
 */
interface Props {
    /** Идёт загрузка данных страницы */
    loading: boolean
    /** Выбран бюджет (показывать «Выберите бюджет» только при !loading && !hasBudget) */
    hasBudget: boolean
    /** Сообщение об ошибке загрузки */
    error?: string | null
    /** Текст для пустого состояния при отсутствии бюджета */
    emptyDescription?: string
}

const props = withDefaults(defineProps<Props>(), {
    error: null,
    emptyDescription: 'Выберите бюджет'
})
</script>

<template>
    <TheSpin :spinning="loading">
        <template v-if="loading">
            <!-- Только спиннер, контент не показываем до завершения загрузки -->
        </template>
        <template v-else-if="!hasBudget">
            <TheEmpty :description="emptyDescription" />
        </template>
        <template v-else-if="props.error">
            <TheAlert
                type="error"
                :message="props.error"
            />
        </template>
        <template v-else>
            <slot />
        </template>
    </TheSpin>
</template>
