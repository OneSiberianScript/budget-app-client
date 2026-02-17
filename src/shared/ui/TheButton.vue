<script setup lang="ts">
import { Button } from 'ant-design-vue'

/**
 * Обёртка над a-button. Корневой класс: the-button.
 */
interface Props {
    /** Визуальный тип кнопки */
    type?: 'primary' | 'default' | 'dashed' | 'link' | 'text'
    /** Атрибут type у элемента button */
    htmlType?: 'button' | 'submit' | 'reset'
    /** Неактивна */
    disabled?: boolean
    /** Состояние загрузки (спиннер) */
    loading?: boolean
    /** Опасное действие (красный акцент) */
    danger?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    type: 'default',
    htmlType: 'button',
    disabled: false,
    loading: false,
    danger: false
})
</script>

<template>
    <Button
        class="the-button"
        :type="props.type"
        :html-type="props.htmlType"
        :disabled="props.disabled"
        :loading="props.loading"
        :danger="props.danger"
        v-bind="$attrs"
    >
        <slot />
    </Button>
</template>
