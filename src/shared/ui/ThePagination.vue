<script setup lang="ts">
import { Pagination } from 'ant-design-vue'

/**
 * Обёртка над a-pagination. Корневой класс: the-pagination.
 */
interface Props {
    /** Текущая страница (v-model) */
    current?: number
    /** Общее количество записей */
    total?: number
    /** Записей на странице */
    pageSize?: number
    /** Размер: default, small */
    size?: 'default' | 'small'
    /** Скрывать при одной странице */
    hideOnSinglePage?: boolean
    /** Показывать селектор размера страницы */
    showSizeChanger?: boolean
    /** Неактивно */
    disabled?: boolean
}

withDefaults(defineProps<Props>(), {
    current: 1,
    total: 0,
    pageSize: 10,
    size: 'default',
    hideOnSinglePage: false,
    showSizeChanger: true,
    disabled: false
})

const emit = defineEmits<{
    'update:current': [page: number]
    'update:pageSize': [size: number]
    change: [page: number, pageSize: number]
}>()
</script>

<template>
    <Pagination
        class="the-pagination"
        :current="current"
        :total="total"
        :page-size="pageSize"
        :size="size"
        :hide-on-single-page="hideOnSinglePage"
        :show-size-changer="showSizeChanger"
        :disabled="disabled"
        v-bind="$attrs"
        @update:current="emit('update:current', $event)"
        @update:page-size="emit('update:pageSize', $event)"
        @change="(page: number, size: number) => emit('change', page, size)"
    />
</template>
