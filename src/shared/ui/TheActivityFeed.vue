<script setup lang="ts">
import { computed } from 'vue'

import type { BudgetMember } from '@/entities/budget-member'
import type { Category } from '@/entities/category'
import { useSessionStore } from '@/entities/session'
import type { Transaction } from '@/entities/transaction'

import { formatMoneyFromCents } from '@/shared/lib/format-money'

/**
 * Лента активности бюджета: последние транзакции с именами участников.
 * Формирует строки вида «Иванов И. добавил −500 ₽ · Кафе».
 * Используется на главной странице в bento-сетке.
 */
interface Props {
    /** Список транзакций (желательно предфильтрованный — только текущий бюджет). */
    transactions: Transaction[]
    /** Участники бюджета для маппинга userId → имя. */
    members: BudgetMember[]
    /** Категории для маппинга categoryId → название. */
    categories: Category[]
    /** Максимальное число строк. По умолчанию 8. */
    maxItems?: number
}

const props = withDefaults(defineProps<Props>(), { maxItems: 8 })

const sessionStore = useSessionStore()

interface FeedItem {
    id: string
    initials: string
    authorName: string
    amountText: string
    categoryName: string | null
    timeText: string
    isExpense: boolean
    isIncome: boolean
}

function getInitials(first: string, last: string): string {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
}

function formatTime(isoDate: string): string {
    const d = new Date(isoDate)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffDays = Math.floor(diffMs / 86_400_000)
    if (diffDays === 0) {
        return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    }
    if (diffDays === 1) return 'вчера'
    if (diffDays < 7) return `${diffDays} дн. назад`
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

const memberMap = computed(() => {
    const map = new Map<string, BudgetMember>()
    for (const m of props.members) map.set(m.userId, m)
    return map
})

const categoryMap = computed(() => {
    const map = new Map<string, Category>()
    for (const c of props.categories) map.set(c.id, c)
    return map
})

const feedItems = computed((): FeedItem[] => {
    const sorted = [...props.transactions].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    return sorted.slice(0, props.maxItems).map((t): FeedItem => {
        const isMe = t.createdById === sessionStore.user?.id
        let authorName: string
        let initials: string
        if (isMe) {
            authorName = 'Вы'
            const me = sessionStore.user
            initials = me ? `${me.firstName.charAt(0)}${me.lastName?.charAt(0) ?? ''}`.toUpperCase() : 'Я'
        } else {
            const member = memberMap.value.get(t.createdById)
            if (member) {
                authorName = `${member.User.firstName} ${member.User.lastName.charAt(0)}.`
                initials = getInitials(member.User.firstName, member.User.lastName)
            } else {
                authorName = 'Участник'
                initials = '?'
            }
        }

        const amountCents = Math.round((parseFloat(t.amount) || 0) * 100)
        const sign = t.type === 'expense' ? '−' : t.type === 'income' ? '+' : ''
        const amountText = `${sign}${formatMoneyFromCents(amountCents)}`

        const category = t.categoryId ? categoryMap.value.get(t.categoryId) : null

        return {
            id: t.id,
            initials,
            authorName,
            amountText,
            categoryName: category?.name ?? null,
            timeText: formatTime(t.createdAt),
            isExpense: t.type === 'expense',
            isIncome: t.type === 'income'
        }
    })
})
</script>

<template>
    <div class="the-activity-feed">
        <p
            v-if="feedItems.length === 0"
            class="the-activity-feed__empty"
        >
            Транзакций пока нет
        </p>
        <ul
            v-else
            class="the-activity-feed__list"
            role="list"
        >
            <li
                v-for="item in feedItems"
                :key="item.id"
                class="the-activity-feed__item"
            >
                <div
                    class="the-activity-feed__avatar"
                    aria-hidden="true"
                >
                    {{ item.initials }}
                </div>
                <div class="the-activity-feed__body">
                    <span class="the-activity-feed__author">{{ item.authorName }}</span>
                    <span
                        class="the-activity-feed__amount"
                        :class="{
                            'the-activity-feed__amount_expense': item.isExpense,
                            'the-activity-feed__amount_income': item.isIncome
                        }"
                    >
                        {{ item.amountText }}
                    </span>
                    <span
                        v-if="item.categoryName"
                        class="the-activity-feed__category"
                    >
                        {{ item.categoryName }}
                    </span>
                </div>
                <time class="the-activity-feed__time">{{ item.timeText }}</time>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.the-activity-feed {
    width: 100%;
}

.the-activity-feed__empty {
    color: var(--color-text-muted);
    font-size: 0.875rem;
    text-align: center;
    padding: 16px 0;
    margin: 0;
}

.the-activity-feed__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
}

.the-activity-feed__item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
    border-bottom: 1px solid var(--color-border-default);
}

.the-activity-feed__item:last-child {
    border-bottom: none;
}

.the-activity-feed__avatar {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--color-accent-soft);
    color: var(--color-text-primary);
    font-size: 0.75rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
}

.the-activity-feed__body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px;
    font-size: 0.875rem;
}

.the-activity-feed__author {
    font-weight: 500;
    color: var(--color-text-primary);
    flex-shrink: 0;
}

.the-activity-feed__amount {
    font-weight: 600;
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
}

.the-activity-feed__amount_expense {
    color: var(--color-semantic-error);
}

.the-activity-feed__amount_income {
    color: var(--color-semantic-success);
}

.the-activity-feed__category {
    color: var(--color-text-muted);
    font-size: 0.8125rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.the-activity-feed__time {
    flex-shrink: 0;
    font-size: 0.75rem;
    color: var(--color-text-muted);
    white-space: nowrap;
}
</style>
