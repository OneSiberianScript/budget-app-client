<script setup lang="ts">
import { Alert } from 'ant-design-vue'

/**
 * Обёртка над a-alert. Корневой класс: the-alert.
 */
interface Props {
    /** Тип: success, info, warning, error */
    type?: 'success' | 'info' | 'warning' | 'error'
    /** Основное сообщение */
    message?: string
    /** Дополнительное описание */
    description?: string
    /** Показывать иконку */
    showIcon?: boolean
    /** Закрываемая (крестик) */
    closable?: boolean
    /** Стиль баннера (с закруглением) */
    banner?: boolean
}

withDefaults(defineProps<Props>(), {
    type: 'info',
    message: '',
    description: undefined,
    showIcon: false,
    closable: false,
    banner: false
})

const emit = defineEmits<{
    close: [e: MouseEvent]
}>()
</script>

<template>
    <Alert
        class="the-alert"
        :type="type"
        :message="message"
        :description="description"
        :show-icon="showIcon"
        :closable="closable"
        :banner="banner"
        v-bind="$attrs"
        @close="emit('close', $event)"
    >
        <template
            v-if="$slots.default"
            #default
        >
            <slot />
        </template>
        <template
            v-if="$slots.message"
            #message
        >
            <slot name="message" />
        </template>
        <template
            v-if="$slots.description"
            #description
        >
            <slot name="description" />
        </template>
        <template
            v-if="$slots.closeIcon"
            #closeIcon
        >
            <slot name="closeIcon" />
        </template>
    </Alert>
</template>
