<script setup lang="ts">
import { Badge } from 'ant-design-vue'

/**
 * Обёртка над a-badge. Корневой класс: the-badge.
 */
interface Props {
    /** Число или строка на значке (0 скрывает) */
    count?: number | string
    /** Только точка без числа */
    dot?: boolean
    /** Статус: success, processing, default, error, warning */
    status?: 'success' | 'processing' | 'default' | 'error' | 'warning'
    /** Цвет значка (строка) */
    color?: string
    /** Максимальное число (при count > max показывается max+) */
    overflowCount?: number
}

withDefaults(defineProps<Props>(), {
    count: undefined,
    dot: false,
    status: undefined,
    color: undefined,
    overflowCount: 99
})
</script>

<template>
    <Badge
        class="the-badge"
        :count="count"
        :dot="dot"
        :status="status"
        :color="color"
        :overflow-count="overflowCount"
        v-bind="$attrs"
    >
        <slot />
    </Badge>
</template>
