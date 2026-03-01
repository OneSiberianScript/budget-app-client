<script setup lang="ts">
import { computed } from 'vue'

/**
 * Кольцевой прогресс-индикатор на SVG.
 * Показывает процент выполнения (0–100) цветом категории.
 * Поддерживает слот по умолчанию для контента внутри (иконка, текст).
 *
 * @example
 * <TheProgressRing :percent="75" color="#f5b72b" :size="56">
 *   <CategoryIcon />
 * </TheProgressRing>
 */
interface Props {
    /** Процент заполнения кольца 0–100. */
    percent: number
    /** Цвет заливки кольца (hex или CSS-переменная). По умолчанию — акцентный цвет темы. */
    color?: string
    /** Размер в px (ширина = высота). По умолчанию 48. */
    size?: number
    /** Толщина кольца в px. По умолчанию 4. */
    strokeWidth?: number
    /** Показывать числовой процент в центре (если нет слота). */
    showLabel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    color: 'var(--color-accent-primary)',
    size: 48,
    strokeWidth: 4,
    showLabel: false
})

const clamped = computed(() => Math.min(100, Math.max(0, props.percent)))
const radius = computed(() => (props.size - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashoffset = computed(() => circumference.value * (1 - clamped.value / 100))
const center = computed(() => props.size / 2)
const trackColor = 'color-mix(in srgb, currentColor 12%, transparent)'
</script>

<template>
    <div
        class="the-progress-ring"
        :style="{ width: `${size}px`, height: `${size}px` }"
        :aria-valuenow="clamped"
        aria-valuemin="0"
        aria-valuemax="100"
        role="progressbar"
    >
        <svg
            :width="size"
            :height="size"
            :viewBox="`0 0 ${size} ${size}`"
            fill="none"
            aria-hidden="true"
        >
            <!-- Трек (фон) -->
            <circle
                :cx="center"
                :cy="center"
                :r="radius"
                :stroke-width="strokeWidth"
                :stroke="trackColor"
                class="the-progress-ring__track"
            />
            <!-- Заполнение -->
            <circle
                :cx="center"
                :cy="center"
                :r="radius"
                :stroke-width="strokeWidth"
                :stroke="color"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="dashoffset"
                stroke-linecap="round"
                class="the-progress-ring__fill"
                transform="rotate(-90)"
                :transform-origin="`${center} ${center}`"
            />
        </svg>
        <!-- Центральный контент -->
        <div
            class="the-progress-ring__inner"
            aria-hidden="true"
        >
            <slot>
                <span
                    v-if="showLabel"
                    class="the-progress-ring__label"
                >
                    {{ Math.round(clamped) }}%
                </span>
            </slot>
        </div>
    </div>
</template>

<style scoped>
.the-progress-ring {
    position: relative;
    flex-shrink: 0;
}

.the-progress-ring svg {
    display: block;
}

.the-progress-ring__fill {
    transition: stroke-dashoffset 0.6s ease-out;
}

.the-progress-ring__inner {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
}

.the-progress-ring__label {
    font-size: 0.6em;
    font-weight: 600;
    color: var(--color-text-primary);
    line-height: 1;
}
</style>
