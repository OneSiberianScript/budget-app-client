<script setup lang="ts">
import { Table } from 'ant-design-vue'

/**
 * Обёртка над a-table. Корневой класс: the-table.
 * Колонки и данные через props или слот по умолчанию для кастомного тела.
 */
interface Column {
    /** Уникальный ключ колонки */
    key?: string
    /** Заголовок колонки */
    title?: string
    /** Ключ(и) в записи для значения */
    dataIndex?: string | string[]
    /** Ширина */
    width?: number | string
    /** Выравнивание содержимого */
    align?: 'left' | 'right' | 'center'
    /** Закрепление слева/справа при горизонтальном скролле */
    fixed?: 'left' | 'right'
    /** Многоточие при переполнении */
    ellipsis?: boolean
    [key: string]: unknown
}

interface PaginationConfig {
    /** Размер страницы */
    pageSize?: number
    /** Общее количество записей */
    total?: number
    /** Текущая страница */
    current?: number
    /** Показывать выбор размера страницы */
    showSizeChanger?: boolean
    [key: string]: unknown
}

interface Props {
    /** Описание колонок */
    columns?: Column[]
    /** Массив записей */
    dataSource?: Record<string, unknown>[]
    /** Состояние загрузки */
    loading?: boolean
    /** Ключ строки (поле или функция) */
    rowKey?: string | ((record: Record<string, unknown>) => string)
    /** Пагинация или false */
    pagination?: false | PaginationConfig
    /** Размер строк */
    size?: 'small' | 'middle' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
    columns: () => [],
    dataSource: () => [],
    loading: false,
    rowKey: 'id',
    pagination: false,
    size: 'middle'
})
</script>

<template>
    <Table
        class="the-table"
        :columns="props.columns"
        :data-source="props.dataSource"
        :loading="props.loading"
        :row-key="props.rowKey"
        :pagination="props.pagination"
        :size="props.size"
        v-bind="$attrs"
    >
        <template
            v-if="$slots.bodyCell"
            #bodyCell="{ column, record, index }"
        >
            <slot
                name="bodyCell"
                :column="column"
                :record="record"
                :index="index"
            />
        </template>
        <template
            v-if="$slots.expandedRowRender"
            #expandedRowRender="scope"
        >
            <slot
                name="expandedRowRender"
                v-bind="scope"
            />
        </template>
        <slot />
    </Table>
</template>
