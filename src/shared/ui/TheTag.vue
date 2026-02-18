<script setup lang="ts">
import { Tag } from 'ant-design-vue'

/**
 * Обёртка над a-tag. Корневой класс: the-tag.
 */
interface Props {
    /** Цвет: preset или hex */
    color?: string
    /** Закрываемый (крестик) */
    closable?: boolean
}

withDefaults(defineProps<Props>(), {
    color: undefined,
    closable: false
})

const emit = defineEmits<{
    close: [e: MouseEvent]
}>()
</script>

<template>
    <Tag
        class="the-tag"
        :color="color"
        :closable="closable"
        v-bind="$attrs"
        @close="emit('close', $event)"
    >
        <slot />
    </Tag>
</template>
