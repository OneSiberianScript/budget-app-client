<script setup lang="ts">
import { Tabs } from 'ant-design-vue'

/**
 * Обёртка над a-tabs. Корневой класс: the-tabs.
 */
interface TabItem {
    key: string
    label: string
    disabled?: boolean
    children?: unknown
}

interface Props {
    /** Ключ активной вкладки (v-model) */
    activeKey?: string
    /** Элементы вкладок (items API) */
    items?: TabItem[]
    /** Позиция вкладок: top, right, bottom, left */
    tabPosition?: 'top' | 'right' | 'bottom' | 'left'
    /** Тип: line, card, editable-card */
    type?: 'line' | 'card' | 'editable-card'
    /** Неактивно */
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    activeKey: undefined,
    items: () => [],
    tabPosition: 'top',
    type: 'line',
    disabled: false
})

const emit = defineEmits<{
    'update:activeKey': [key: string]
    change: [key: string]
}>()
</script>

<template>
    <Tabs
        :active-key="props.activeKey"
        class="the-tabs"
        :items="items"
        :tab-position="tabPosition"
        :type="type"
        :disabled="disabled"
        v-bind="$attrs"
        @update:active-key="emit('update:activeKey', String($event))"
        @change="emit('change', String($event))"
    >
        <slot />
    </Tabs>
</template>
