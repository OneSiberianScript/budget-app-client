<script setup lang="ts">
import { Empty } from 'ant-design-vue'

/**
 * Обёртка над a-empty. Корневой класс: the-empty.
 */
interface Props {
    /** Текст под иконкой «нет данных» */
    description?: string
}

const props = withDefaults(defineProps<Props>(), {
    description: 'Нет данных'
})
</script>

<template>
    <Empty
        class="the-empty"
        :description="props.description"
        v-bind="$attrs"
    >
        <template
            v-if="$slots.default"
            #default
        >
            <slot />
        </template>
        <template
            v-else-if="$slots.image"
            #image
        >
            <slot name="image" />
        </template>
    </Empty>
</template>
