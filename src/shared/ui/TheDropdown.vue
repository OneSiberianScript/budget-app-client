<script setup lang="ts">
import { Dropdown } from 'ant-design-vue'

/**
 * Обёртка над a-dropdown. Корневой класс: the-dropdown.
 */
interface Props {
    /** Способ вызова: click, hover, contextmenu */
    trigger?: 'click' | 'hover' | 'contextmenu' | ('click' | 'hover' | 'contextmenu')[]
    /** Позиция выпадающего меню */
    placement?: 'top' | 'topLeft' | 'topCenter' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomCenter' | 'bottomRight'
    /** Показывать стрелку */
    arrow?: boolean
    /** Отключено */
    disabled?: boolean
}

withDefaults(defineProps<Props>(), {
    trigger: 'hover',
    placement: 'bottomLeft',
    arrow: false,
    disabled: false
})
</script>

<template>
    <Dropdown
        class="the-dropdown"
        :trigger="trigger"
        :placement="placement"
        :arrow="arrow"
        :disabled="disabled"
        v-bind="$attrs"
    >
        <slot />
        <template #overlay>
            <slot name="overlay" />
        </template>
    </Dropdown>
</template>
