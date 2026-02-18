<script setup lang="ts">
import { Menu } from 'ant-design-vue'

/**
 * Обёртка над a-menu. Корневой класс: the-menu.
 */
interface Props {
    /** Режим отображения: vertical, horizontal, inline */
    mode?: 'vertical' | 'horizontal' | 'inline'
    /** Выбранные ключи (контролируемый режим) */
    selectedKeys?: string[]
    /** Открытые ключи подменю (inline) */
    openKeys?: string[]
    /** Тема: light, dark */
    theme?: 'light' | 'dark'
    /** Элементы меню (items API ant-design-vue) */
    items?: { key: string; label?: string; children?: unknown[] }[]
    /** Неактивно */
    disabled?: boolean
}

withDefaults(defineProps<Props>(), {
    mode: 'vertical',
    selectedKeys: () => [],
    openKeys: () => [],
    theme: 'light',
    items: () => [],
    disabled: false
})

const emit = defineEmits<{
    'update:selectedKeys': [keys: string[]]
    'update:openKeys': [keys: string[]]
    select: [payload: { key: string; keyPath: string[] }]
}>()
</script>

<template>
    <Menu
        class="the-menu"
        :mode="mode"
        :selected-keys="selectedKeys"
        :open-keys="openKeys"
        :items="items"
        :theme="theme"
        :disabled="disabled"
        v-bind="$attrs"
        @update:selected-keys="emit('update:selectedKeys', $event as string[])"
        @update:open-keys="emit('update:openKeys', $event as string[])"
        @select="emit('select', { key: String($event.key), keyPath: ($event.keyPath || []).map(String) })"
    >
        <slot />
    </Menu>
</template>
