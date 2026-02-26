<script setup lang="ts">
/**
 * Блок линий прогресса по категориям плана: на всю ширину, в столбик.
 * В каждой линии: слева заливка (процент выполнения плана) цветом категории,
 * по центру название категории, справа остаток (рубли). Клик по строке эмитит clickLine.
 */
import { computed } from 'vue'

import { formatMoneyFromCents } from '@/shared/lib/format-money'

/**
 * Элемент строки: категория и суммы в копейках для отображения прогресса и остатка.
 */
export interface CategoryPlanLineItem {
    /** Уникальный идентификатор строки (например categoryId). */
    id: string
    /** Идентификатор категории бюджета. */
    categoryId: string
    /** Название категории бюджета. */
    categoryName: string
    /** Цвет категории для заливки (из параметров категории). */
    color?: string | null
    /** Запланированная сумма, копейки. */
    plannedCents: number
    /** Фактическая сумма за период, копейки. */
    actualCents: number
    /** Id элемента плана по этой категории (если лимит задан). */
    planItemId?: string
}

interface Props {
    /**
     * Список строк: категория, план и факт в копейках.
     * Процент и остаток вычисляются внутри компонента.
     */
    items?: CategoryPlanLineItem[]
    /**
     * Тип для семантики остатка: расход — остаток = план − факт;
     * доход — остаток = факт − план (превышение).
     */
    type?: 'expense' | 'income'
}

const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    type: 'expense'
})

const normalizedItems = computed(() => (Array.isArray(props.items) ? props.items : []))

/** Строка с вычисленными полями процента и остатка. */
export interface CategoryPlanLineWithMeta extends CategoryPlanLineItem {
    percent: number
    remainderCents: number
}

/** Для каждой строки: процент выполнения (cap 100% для заливки), остаток в копейках. */
const linesWithMeta = computed((): CategoryPlanLineWithMeta[] =>
    normalizedItems.value.map((item) => {
        const planned = item.plannedCents
        const actual = item.actualCents
        const percent = planned > 0 ? Math.min(100, (actual / planned) * 100) : 0
        const remainderCents = props.type === 'expense' ? planned - actual : actual - planned
        return {
            ...item,
            percent,
            remainderCents
        }
    })
)

function formatRemainder(cents: number): string {
    return formatMoneyFromCents(Math.abs(cents))
}

const emit = defineEmits<{
    /** Клик по строке; аргумент — объект строки с полями id, categoryId, planItemId и др. */
    clickLine: [line: CategoryPlanLineWithMeta]
}>()

function onLineClick(line: CategoryPlanLineWithMeta) {
    emit('clickLine', line)
}
</script>

<template>
    <ul
        class="the-category-plan-lines"
        role="list"
    >
        <li
            v-for="line in linesWithMeta"
            :key="line.id"
            class="the-category-plan-lines__line"
            role="button"
            tabindex="0"
            @click="onLineClick(line)"
            @keydown.enter="onLineClick(line)"
            @keydown.space.prevent="onLineClick(line)"
        >
            <div
                class="the-category-plan-lines__fill"
                :style="{
                    width: `${line.percent}%`,
                    background: line.color || 'var(--color-primary, #1677ff)'
                }"
                aria-hidden="true"
            />
            <span class="the-category-plan-lines__name">
                {{ line.categoryName }}
            </span>
            <span class="the-category-plan-lines__remainder">
                {{ formatRemainder(line.remainderCents) }}
            </span>
        </li>
    </ul>
</template>

<style scoped>
.the-category-plan-lines {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
    width: 100%;
}

.the-category-plan-lines__line {
    display: flex;
    align-items: center;
    min-height: 44px;
    position: relative;
    border-bottom: 1px solid var(--color-border-secondary, #f0f0f0);
    cursor: pointer;
}

.the-category-plan-lines__line:last-child {
    border-bottom: none;
}

.the-category-plan-lines__fill {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    opacity: 0.2;
    pointer-events: none;
}

.the-category-plan-lines__name {
    flex: 1;
    text-align: center;
    padding: 0 8px;
    position: relative;
    z-index: 1;
}

.the-category-plan-lines__remainder {
    flex-shrink: 0;
    position: relative;
    z-index: 1;
    color: var(--color-text-secondary);
    font-variant-numeric: tabular-nums;
}
</style>
