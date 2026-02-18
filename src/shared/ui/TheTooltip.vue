<script setup lang="ts">
import { Tooltip } from 'ant-design-vue'

/**
 * Обёртка над a-tooltip. Корневой класс: the-tooltip.
 */
interface Props {
    /** Текст подсказки (или слот title) */
    title?: string
    /** Позиция: top, left, right, bottom и варианты */
    placement?:
        | 'top'
        | 'topLeft'
        | 'topRight'
        | 'bottom'
        | 'bottomLeft'
        | 'bottomRight'
        | 'left'
        | 'leftTop'
        | 'leftBottom'
        | 'right'
        | 'rightTop'
        | 'rightBottom'
    /** Способ вызова: hover, focus, click */
    trigger?: 'hover' | 'focus' | 'click'
}

withDefaults(defineProps<Props>(), {
    title: undefined,
    placement: 'top',
    trigger: 'hover'
})
</script>

<template>
    <Tooltip
        class="the-tooltip"
        :title="title"
        :placement="placement"
        :trigger="trigger"
        v-bind="$attrs"
    >
        <template
            v-if="$slots.default"
            #default
        >
            <slot />
        </template>
        <template
            v-if="$slots.title"
            #title
        >
            <slot name="title" />
        </template>
    </Tooltip>
</template>
