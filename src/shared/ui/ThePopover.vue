<script setup lang="ts">
import { Popover } from 'ant-design-vue'

/**
 * Обёртка над a-popover. Корневой класс: the-popover.
 */
interface Props {
    /** Заголовок всплывающей панели */
    title?: string
    /** Текстовое содержимое (если без слота) */
    content?: string
    /** Способ вызова: hover, focus, click */
    trigger?: 'hover' | 'focus' | 'click'
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
}

withDefaults(defineProps<Props>(), {
    title: undefined,
    content: undefined,
    trigger: 'hover',
    placement: 'top'
})
</script>

<template>
    <Popover
        class="the-popover"
        :title="title"
        :content="content"
        :trigger="trigger"
        :placement="placement"
        v-bind="$attrs"
    >
        <template
            v-if="$slots.default"
            #default
        >
            <slot />
        </template>
        <template
            v-if="$slots.content"
            #content
        >
            <slot name="content" />
        </template>
        <template
            v-if="$slots.title"
            #title
        >
            <slot name="title" />
        </template>
    </Popover>
</template>
