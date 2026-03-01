<script setup lang="ts">
import { computed } from 'vue'

/**
 * Карточка онбординга для новых пользователей.
 * Показывается на главной странице, если нет категорий или транзакций.
 * Ведёт по двум шагам: создать категорию → добавить транзакцию.
 */
interface Props {
    /** Есть ли у бюджета хотя бы одна категория. */
    hasCategories: boolean
    /** Есть ли у бюджета хотя бы одна транзакция. */
    hasTransactions: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
    /** Клик на «Создать категорию» */
    goCategories: []
    /** Клик на «Добавить транзакцию» */
    goAddTransaction: []
}>()

const steps = computed(() => [
    {
        id: 'categories',
        title: 'Создайте категорию',
        description: 'Категории помогают группировать расходы и доходы для аналитики.',
        done: props.hasCategories,
        action: () => emit('goCategories'),
        actionLabel: 'Создать категорию'
    },
    {
        id: 'transaction',
        title: 'Добавьте первую транзакцию',
        description: 'Зафиксируйте трату или поступление — и данные на главной оживут.',
        done: props.hasTransactions,
        active: props.hasCategories,
        action: () => emit('goAddTransaction'),
        actionLabel: 'Добавить транзакцию'
    }
])
</script>

<template>
    <div class="the-onboarding-card">
        <h2 class="the-onboarding-card__title">Начните работу с бюджетом</h2>
        <p class="the-onboarding-card__subtitle">Выполните 2 шага, чтобы увидеть аналитику</p>

        <ol class="the-onboarding-card__steps">
            <li
                v-for="(step, i) in steps"
                :key="step.id"
                class="the-onboarding-card__step"
                :class="{
                    'the-onboarding-card__step_done': step.done,
                    'the-onboarding-card__step_inactive': !step.done && !step.active && i !== 0
                }"
            >
                <div class="the-onboarding-card__step-number">
                    <svg
                        v-if="step.done"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            d="M3 8l3.5 3.5L13 5"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                    <span v-else>{{ i + 1 }}</span>
                </div>
                <div class="the-onboarding-card__step-body">
                    <span class="the-onboarding-card__step-title">{{ step.title }}</span>
                    <span class="the-onboarding-card__step-desc">{{ step.description }}</span>
                    <button
                        v-if="!step.done"
                        type="button"
                        class="the-onboarding-card__step-btn"
                        :disabled="!step.active && i !== 0"
                        @click="step.action()"
                    >
                        {{ step.actionLabel }}
                    </button>
                </div>
            </li>
        </ol>
    </div>
</template>

<style scoped>
.the-onboarding-card {
    padding: 24px;
    background: var(--color-bg-secondary);
    border-radius: 12px;
    border: 1px solid var(--color-border-default);
}

.the-onboarding-card__title {
    margin: 0 0 4px;
    font-size: var(--font-size-title, 1.5rem);
    font-weight: 700;
    color: var(--color-text-primary);
}

.the-onboarding-card__subtitle {
    margin: 0 0 24px;
    font-size: 0.9375rem;
    color: var(--color-text-secondary);
}

.the-onboarding-card__steps {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.the-onboarding-card__step {
    display: flex;
    gap: 12px;
    align-items: flex-start;
}

.the-onboarding-card__step_inactive {
    opacity: 0.5;
}

.the-onboarding-card__step-number {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--color-accent-primary);
    color: var(--color-text-inverse);
    font-size: 0.875rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
}

.the-onboarding-card__step_done .the-onboarding-card__step-number {
    background: var(--color-semantic-success);
}

.the-onboarding-card__step-number svg {
    width: 14px;
    height: 14px;
}

.the-onboarding-card__step-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-top: 4px;
}

.the-onboarding-card__step-title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--color-text-primary);
    line-height: 1.3;
}

.the-onboarding-card__step_done .the-onboarding-card__step-title {
    text-decoration: line-through;
    color: var(--color-text-muted);
}

.the-onboarding-card__step-desc {
    font-size: 0.8125rem;
    color: var(--color-text-secondary);
    line-height: 1.4;
}

.the-onboarding-card__step-btn {
    margin-top: 8px;
    align-self: flex-start;
    padding: 6px 16px;
    border: none;
    border-radius: 6px;
    background: var(--color-accent-primary);
    color: var(--color-text-inverse);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
}

.the-onboarding-card__step-btn:hover:not(:disabled) {
    background: var(--color-accent-hover);
}

.the-onboarding-card__step-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}
</style>
