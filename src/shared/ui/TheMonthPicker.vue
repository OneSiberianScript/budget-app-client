<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    /** Выбранный месяц в формате YYYY-MM (v-model). */
    modelValue: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const currentYear = new Date().getFullYear()

/** Метка месяца: «Март» если текущий год, иначе «Март 2025». */
const displayLabel = computed(() => {
    const [year, month] = props.modelValue.split('-').map(Number)
    const date = new Date(year, month - 1, 1)
    const monthName = new Intl.DateTimeFormat('ru', { month: 'long' }).format(date)
    const capitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1)
    return year === currentYear ? capitalized : `${capitalized} ${year}`
})

function shift(delta: number) {
    const [year, month] = props.modelValue.split('-').map(Number)
    const date = new Date(year, month - 1 + delta, 1)
    const newYear = date.getFullYear()
    const newMonth = String(date.getMonth() + 1).padStart(2, '0')
    emit('update:modelValue', `${newYear}-${newMonth}`)
}
</script>

<template>
    <div class="the-month-picker">
        <button
            type="button"
            class="the-month-picker__btn"
            aria-label="Предыдущий месяц"
            @click="shift(-1)"
        >
            <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
            >
                <path
                    d="M10 12L6 8l4-4"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        </button>

        <span class="the-month-picker__label">{{ displayLabel }}</span>

        <button
            type="button"
            class="the-month-picker__btn"
            aria-label="Следующий месяц"
            @click="shift(1)"
        >
            <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
            >
                <path
                    d="M6 4l4 4-4 4"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        </button>
    </div>
</template>

<style scoped>
.the-month-picker {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-default);
    border-radius: 12px;
    padding: 10px 16px;
}

.the-month-picker__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 8px;
    background: var(--color-bg-tertiary);
    color: var(--color-text-secondary);
    cursor: pointer;
    transition:
        background 0.15s,
        color 0.15s;
}

.the-month-picker__btn:hover {
    background: var(--color-bg-hover);
    color: var(--color-text-primary);
}

.the-month-picker__label {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text-primary);
    letter-spacing: -0.01em;
}
</style>
