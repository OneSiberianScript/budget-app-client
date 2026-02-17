<script setup lang="ts">
import { Spin } from 'ant-design-vue'

/**
 * Обёртка над a-spin. Корневой класс: the-spin.
 */
interface Props {
    /** Показывать спиннер */
    spinning?: boolean
    /** Размер спиннера */
    size?: 'small' | 'default' | 'large'
    /** Текст под спиннером */
    tip?: string
}

withDefaults(defineProps<Props>(), {
    spinning: true,
    size: 'default',
    tip: ''
})
</script>

<template>
    <Spin
        class="the-spin"
        v-bind="$attrs"
    >
        <template
            v-if="$slots.default"
            #default
        >
            <slot />
        </template>
    </Spin>
</template>
