<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { getCategoryIconComponent, type Category } from '@/entities/category'
import type { Transaction } from '@/entities/transaction'

import { ROUTE_NAMES } from '@/shared/config/router'
import { formatMoneyFromCents } from '@/shared/lib/format-money'

interface Props {
    categories: Category[]
    transactions: Transaction[]
}

const props = defineProps<Props>()
const router = useRouter()

const FALLBACK_COLOR = '#8c8c8c'

interface TopCategory {
    id: string
    name: string
    color: string
    icon: string | null
    amountCents: number
    maxCents: number
}

const topCategories = computed((): TopCategory[] => {
    const expenseCategories = props.categories.filter((c) => c.type === 'expense')
    const sumByCat: Record<string, number> = {}
    for (const t of props.transactions) {
        if (t.type !== 'expense' || !t.categoryId) continue
        const cents = Math.round((parseFloat(t.amount) || 0) * 100)
        sumByCat[t.categoryId] = (sumByCat[t.categoryId] ?? 0) + cents
    }
    const sorted = expenseCategories
        .map((c) => ({ category: c, cents: sumByCat[c.id] ?? 0 }))
        .filter((x) => x.cents > 0)
        .sort((a, b) => b.cents - a.cents)
        .slice(0, 3)

    const maxCents = sorted[0]?.cents ?? 1
    return sorted.map(({ category, cents }) => ({
        id: category.id,
        name: category.name,
        color: category.color ?? FALLBACK_COLOR,
        icon: category.icon,
        amountCents: cents,
        maxCents
    }))
})
</script>

<template>
    <div class="home-top-categories-card">
        <div class="home-top-categories-card__header">
            <span class="home-top-categories-card__label">Топ расходов</span>
            <button
                type="button"
                class="home-top-categories-card__link"
                @click="router.push({ name: ROUTE_NAMES.CATEGORIES })"
            >
                Все →
            </button>
        </div>

        <div
            v-if="topCategories.length === 0"
            class="home-top-categories-card__empty"
        >
            Нет расходов за период
        </div>

        <ul
            v-else
            class="home-top-categories-card__list"
        >
            <li
                v-for="cat in topCategories"
                :key="cat.id"
                class="home-top-categories-card__item"
            >
                <div
                    class="home-top-categories-card__icon-wrap"
                    :style="{ background: `${cat.color}22` }"
                >
                    <component
                        :is="getCategoryIconComponent(cat.icon)"
                        class="home-top-categories-card__icon"
                        :style="{ color: cat.color }"
                        aria-hidden="true"
                    />
                </div>
                <div class="home-top-categories-card__info">
                    <span class="home-top-categories-card__name">{{ cat.name }}</span>
                    <div class="home-top-categories-card__bar-wrap">
                        <div
                            class="home-top-categories-card__bar"
                            :style="{
                                width: `${(cat.amountCents / cat.maxCents) * 100}%`,
                                background: cat.color
                            }"
                        />
                    </div>
                </div>
                <span class="home-top-categories-card__amount">
                    {{ formatMoneyFromCents(cat.amountCents) }}
                </span>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.home-top-categories-card {
    background: var(--color-bg-secondary);
    border-radius: 12px;
    border: 1px solid var(--color-border-default);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.home-top-categories-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.home-top-categories-card__label {
    font-size: 0.8125rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-muted);
}

.home-top-categories-card__link {
    font-size: 0.8125rem;
    color: var(--color-accent-primary);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-weight: 500;
}

.home-top-categories-card__link:hover {
    color: var(--color-accent-hover);
}

.home-top-categories-card__empty {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    text-align: center;
    padding: 16px 0;
}

.home-top-categories-card__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.home-top-categories-card__item {
    display: flex;
    align-items: center;
    gap: 10px;
}

.home-top-categories-card__icon-wrap {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.home-top-categories-card__icon {
    width: 18px;
    height: 18px;
}

.home-top-categories-card__info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.home-top-categories-card__name {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.home-top-categories-card__bar-wrap {
    height: 4px;
    background: var(--color-bg-tertiary);
    border-radius: 2px;
    overflow: hidden;
}

.home-top-categories-card__bar {
    height: 100%;
    border-radius: 2px;
    transition: width 0.6s ease-out;
}

.home-top-categories-card__amount {
    flex-shrink: 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-semantic-error);
    font-variant-numeric: tabular-nums;
}
</style>
