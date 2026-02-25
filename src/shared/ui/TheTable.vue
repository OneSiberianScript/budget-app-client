<script setup lang="ts">
import { DeleteOutlined, EditOutlined } from '@ant-design/icons-vue'
import { Button, Table } from 'ant-design-vue'
import { computed } from 'vue'

/**
 * Обёртка над a-table. Корневой класс: the-table.
 * Колонки и данные через props или слот по умолчанию для кастомного тела.
 * При передаче actionHandlers колонка с key: 'action' рендерит иконки редактирования и удаления.
 */
interface ActionHandlers {
    /** Вызов при клике на иконку редактирования */
    onEdit?: (record: Record<string, unknown>) => void
    /** Вызов при клике на иконку удаления */
    onDelete?: (record: Record<string, unknown>) => void
}

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
    /** Массив записей (при неверном типе, напр. строка при ошибке API, нормализуется в []). */
    dataSource?: Record<string, unknown>[] | unknown
    /** Состояние загрузки */
    loading?: boolean
    /** Ключ строки (поле или функция) */
    rowKey?: string | ((record: Record<string, unknown>) => string)
    /** Пагинация или false */
    pagination?: false | PaginationConfig
    /** Размер строк */
    size?: 'small' | 'middle' | 'large'
    /**
     * Обработчики для колонки действий (key: 'action').
     * При задании таблица рендерит иконки «редактировать» и «удалить» вместо слота bodyCell для этой колонки.
     */
    actionHandlers?: ActionHandlers
}

const props = withDefaults(defineProps<Props>(), {
    columns: () => [],
    dataSource: () => [],
    loading: false,
    rowKey: 'id',
    pagination: false,
    size: 'middle',
    actionHandlers: undefined
})

/** Всегда массив, чтобы a-table не падал на .forEach/.some при неверной форме данных (напр. объект из API). */
const normalizedDataSource = computed(() => (Array.isArray(props.dataSource) ? props.dataSource : []))

const hasActionHandlers = computed(
    () => !!props.actionHandlers && (!!props.actionHandlers.onEdit || !!props.actionHandlers.onDelete)
)

function useDefaultActionCell(column: { key?: string | number } | undefined): boolean {
    return column?.key === 'action' && hasActionHandlers.value
}
</script>

<template>
    <Table
        class="the-table"
        :columns="props.columns"
        :data-source="normalizedDataSource"
        :loading="props.loading"
        :row-key="props.rowKey"
        :pagination="props.pagination"
        :size="props.size"
        v-bind="$attrs"
    >
        <template
            v-if="$slots.bodyCell || hasActionHandlers"
            #bodyCell="{ column, record, index }"
        >
            <template v-if="useDefaultActionCell(column)">
                <span class="the-table__actions">
                    <slot
                        name="actionPrepend"
                        :record="record"
                    />
                    <Button
                        v-if="props.actionHandlers?.onEdit"
                        type="text"
                        size="small"
                        class="the-table__action-btn the-table__action-btn_edit"
                        aria-label="Редактировать"
                        title="Редактировать"
                        @click="props.actionHandlers!.onEdit!(record)"
                    >
                        <EditOutlined />
                    </Button>
                    <Button
                        v-if="props.actionHandlers?.onDelete"
                        type="text"
                        size="small"
                        danger
                        class="the-table__action-btn the-table__action-btn_delete"
                        aria-label="Удалить"
                        title="Удалить"
                        @click="props.actionHandlers!.onDelete!(record)"
                    >
                        <DeleteOutlined />
                    </Button>
                </span>
            </template>
            <slot
                v-else-if="$slots.bodyCell"
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

<style scoped>
.the-table__actions {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.the-table__action-btn_edit {
    color: var(--color-text-primary);
}

.the-table__action-btn_edit:hover {
    color: var(--color-text-primary);
    opacity: 0.8;
}

.the-table__action-btn_delete {
    color: var(--color-error);
}

.the-table__action-btn_delete:hover {
    color: var(--color-error);
    opacity: 0.8;
}
</style>
