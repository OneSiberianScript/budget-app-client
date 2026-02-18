<script setup lang="ts">
import { Popconfirm } from 'ant-design-vue'

/**
 * Обёртка над a-popconfirm. Корневой класс: the-popconfirm.
 */
interface Props {
    /** Заголовок подтверждения */
    title?: string
    /** Подпись кнопки подтверждения */
    okText?: string
    /** Подпись кнопки отмены */
    cancelText?: string
    /** Тип кнопки подтверждения: primary, danger */
    okType?: 'primary' | 'danger' | 'dashed' | 'link' | 'text' | 'default'
    /** Способ вызова: hover, focus, click */
    trigger?: 'hover' | 'focus' | 'click'
}

withDefaults(defineProps<Props>(), {
    title: 'Подтвердить действие?',
    okText: 'Подтвердить',
    cancelText: 'Отмена',
    okType: 'primary',
    trigger: 'click'
})

const emit = defineEmits<{
    confirm: [e?: MouseEvent]
    cancel: [e?: MouseEvent]
}>()
</script>

<template>
    <Popconfirm
        class="the-popconfirm"
        :title="title"
        :ok-text="okText"
        :cancel-text="cancelText"
        :ok-type="okType"
        :trigger="trigger"
        v-bind="$attrs"
        @confirm="emit('confirm', $event)"
        @cancel="emit('cancel', $event)"
    >
        <template
            v-if="$slots.default"
            #default
        >
            <slot />
        </template>
        <template
            v-if="$slots.icon"
            #icon
        >
            <slot name="icon" />
        </template>
    </Popconfirm>
</template>
