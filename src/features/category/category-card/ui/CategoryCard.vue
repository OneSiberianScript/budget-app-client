<script setup lang="ts">
import { computed } from 'vue'

import { getCategoryIconComponent } from '@/entities/category'
import type { Category } from '@/entities/category'

/**
 * Карточка категории для грида: круг с иконкой, цветом и заливкой по проценту (факт/план), подпись.
 * По нажатию на всю карточку открывается редактирование (эмит edit).
 * Используется на странице «Категории» на мобильных и планшетах.
 */
interface Props {
    /** Категория (название, цвет, иконка). */
    category: Category
    /** Процент заполнения круга (0–100): факт/план за текущий месяц. */
    fillPercent: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
    edit: [category: Category]
}>()

const iconComponent = computed(() => getCategoryIconComponent(props.category.icon))

const circleColor = computed(() => props.category.color ?? 'var(--color-text-tertiary, #8c8c8c)')

const clampedPercent = computed(() => Math.min(100, Math.max(0, props.fillPercent)))
</script>

<template>
    <div
        class="category-card"
        role="button"
        tabindex="0"
        :aria-label="`Редактировать «${category.name}»`"
        @click="emit('edit', category)"
        @keydown.enter.prevent="emit('edit', category)"
        @keydown.space.prevent="emit('edit', category)"
    >
        <div class="category-card__circle-wrap">
            <div
                class="category-card__circle"
                :style="{ '--category-color': circleColor, '--fill-percent': `${clampedPercent}%` }"
            >
                <div class="category-card__fill" />
                <component
                    :is="iconComponent"
                    class="category-card__icon"
                    aria-hidden
                />
            </div>
        </div>
        <p class="category-card__label">{{ category.name }}</p>
    </div>
</template>

<style scoped>
.category-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 0;
    cursor: pointer;
}

.category-card__circle-wrap {
    flex-shrink: 0;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
}

.category-card__circle {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: color-mix(in srgb, var(--category-color) 25%, transparent);
    overflow: hidden;
}

.category-card__fill {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--fill-percent, 0%);
    background: var(--category-color);
    transition: height 0.2s ease;
}

.category-card__icon {
    position: absolute;
    inset: 0;
    margin: auto;
    width: 1.25rem;
    height: 1.25rem;
    color: var(--color-text-primary, rgba(0, 0, 0, 0.88));
    pointer-events: none;
}

.category-card__label {
    margin: 4px 0 0;
    padding: 0;
    font-size: 0.75rem;
    line-height: 1.3;
    color: var(--color-text-secondary);
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
}
</style>
