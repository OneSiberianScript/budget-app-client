<script setup lang="ts">
import { Segmented } from 'ant-design-vue'

/**
 * Обёртка над a-segmented. Корневой класс: the-segmented.
 */
interface SegmentedOption {
    label: string | number
    value: string | number
    disabled?: boolean
}

interface Props {
    /** Выбранное значение (v-model) */
    value?: string | number
    /** Опции сегментов (label, value) */
    options?: SegmentedOption[]
    /** Неактивно */
    disabled?: boolean
    /** Размер: large, small */
    size?: 'large' | 'small'
}

const props = withDefaults(defineProps<Props>(), {
    value: undefined,
    options: () => [],
    disabled: false,
    size: 'small'
})

const emit = defineEmits<{
    'update:value': [value: string | number]
}>()
</script>

<template>
    <Segmented
        :value="props.value"
        class="the-segmented"
        :options="options"
        :disabled="disabled"
        :size="size"
        v-bind="$attrs"
        @update:value="emit('update:value', $event)"
    >
        <slot />
    </Segmented>
</template>
