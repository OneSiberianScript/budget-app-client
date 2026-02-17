<script setup lang="ts">
import { Drawer } from 'ant-design-vue'

/**
 * Обёртка над a-drawer. Корневой класс: the-drawer.
 */
interface Props {
    /** Видимость панели (v-model:open) */
    open: boolean
    /** Заголовок */
    title?: string
    /** С какой стороны выезжает панель */
    placement?: 'top' | 'right' | 'bottom' | 'left'
    /** Ширина панели (для left/right) */
    width?: number | string
    /** Показывать кнопку закрытия */
    closable?: boolean
}

withDefaults(defineProps<Props>(), {
    title: '',
    placement: 'right',
    width: 400,
    closable: true
})

const emit = defineEmits<{
    'update:open': [value: boolean]
}>()
</script>

<template>
    <Drawer
        class="the-drawer"
        :open="open"
        :title="title"
        :placement="placement"
        :width="width"
        :closable="closable"
        v-bind="$attrs"
        @update:open="emit('update:open', $event)"
    >
        <slot />
    </Drawer>
</template>
