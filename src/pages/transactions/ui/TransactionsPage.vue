<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { ref, computed } from 'vue'

import { QuickTransactionFab } from '@/features/transaction/quick-add'
import { TransactionForm } from '@/features/transaction/transaction-form'
import type { TransactionFormValues } from '@/features/transaction/transaction-form'

import { useAccountStore } from '@/entities/account'
import { useBudgetStore } from '@/entities/budget'
import { useCategoryStore } from '@/entities/category'
import { useSessionStore } from '@/entities/session'
import { useTransactionStore } from '@/entities/transaction'
import type { Transaction } from '@/entities/transaction'
import { createTransaction, updateTransaction, deleteTransaction } from '@/entities/transaction/api'

import { confirm } from '@/shared/lib/confirm'
import { getCurrentMonth } from '@/shared/lib/date'
import { formatRubles } from '@/shared/lib/format-money'
import { message } from '@/shared/lib/message'
import { usePageData } from '@/shared/lib/usePageData'
import {
    TheCreateButton,
    TheDrawer,
    ThePageDataBoundary,
    ThePageHeader,
    TheSpendingPulseChart,
    TheTable
} from '@/shared/ui'

const budgetStore = useBudgetStore()
const accountStore = useAccountStore()
const categoryStore = useCategoryStore()
const sessionStore = useSessionStore()
const transactionStore = useTransactionStore()

const drawerOpen = ref(false)
const editingTransaction = ref<Transaction | null>(null)

const hasBudget = computed(() => !!budgetStore.currentBudgetId)

const accountOptions = computed(() =>
    (Array.isArray(accountStore.accounts) ? accountStore.accounts : []).map((a) => ({ label: a.name, value: a.id }))
)
const categoryOptions = computed(() =>
    (Array.isArray(categoryStore.categories) ? categoryStore.categories : []).map((c) => ({
        label: c.name,
        value: c.id
    }))
)

function accountName(id: string) {
    const list = Array.isArray(accountStore.accounts) ? accountStore.accounts : []
    return list.find((a) => a.id === id)?.name ?? id
}
function categoryName(id: string) {
    const list = Array.isArray(categoryStore.categories) ? categoryStore.categories : []
    return list.find((c) => c.id === id)?.name ?? id
}

const EMPTY_FILTER_VALUE = '__empty__'

/** Desktop: ≥768px; на мобилках и планшетах скрываем столбцы «Списание» и «Зачисление». */
const isDesktop = useMediaQuery('(min-width: 768px)')
/** Планшет и выше: ≥576px; на мобилках скрываем столбец «Описание». */
const isTabletOrDesktop = useMediaQuery('(min-width: 576px)')

function formatDate(dateStr: string) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const columns = computed(() => {
    const transactions = Array.isArray(transactionStore.transactions) ? transactionStore.transactions : []
    const accounts = Array.isArray(accountStore.accounts) ? accountStore.accounts : []
    const categories = Array.isArray(categoryStore.categories) ? categoryStore.categories : []

    const dateFilters = [...new Set(transactions.map((t) => t.occurredAt))]
        .sort()
        .map((d) => ({ text: formatDate(d), value: d }))

    const debitFilters = [
        ...accounts.map((a) => ({ text: a.name, value: a.id })),
        ...(transactions.some((t) => !t.debitAccountId) ? [{ text: '—', value: EMPTY_FILTER_VALUE }] : [])
    ]
    const creditFilters = [
        ...accounts.map((a) => ({ text: a.name, value: a.id })),
        ...(transactions.some((t) => !t.creditAccountId) ? [{ text: '—', value: EMPTY_FILTER_VALUE }] : [])
    ]
    const categoryFilters = [
        ...categories.map((c) => ({ text: c.name, value: c.id })),
        ...(transactions.some((t) => !t.categoryId) ? [{ text: '—', value: EMPTY_FILTER_VALUE }] : [])
    ]

    const baseColumns = [
        {
            title: 'Дата',
            dataIndex: 'occurredAt',
            key: 'occurredAt',
            width: 110,
            filters: dateFilters,
            onFilter: (value: string, record: Record<string, unknown>) =>
                (record as unknown as Transaction).occurredAt === value,
            sorter: (a: Transaction, b: Transaction) =>
                new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime()
        },
        {
            title: 'Категория',
            dataIndex: 'categoryId',
            key: 'categoryId',
            filters: categoryFilters,
            onFilter: (value: string, record: Record<string, unknown>) => {
                const id = (record as unknown as Transaction).categoryId
                return value === EMPTY_FILTER_VALUE ? !id : id === value
            }
        },
        ...(isTabletOrDesktop.value ? [{ title: 'Описание', dataIndex: 'description', key: 'description' }] : []),
        {
            title: 'Сумма',
            dataIndex: 'amount',
            key: 'amount',
            width: 120,
            sorter: (a: Transaction, b: Transaction) => parseFloat(a.amount) - parseFloat(b.amount)
        },
        ...(isDesktop.value
            ? [
                  {
                      title: 'Списание',
                      dataIndex: 'debitAccountId',
                      key: 'debitAccountId',
                      filters: debitFilters,
                      onFilter: (value: string, record: Record<string, unknown>) => {
                          const id = (record as unknown as Transaction).debitAccountId
                          return value === EMPTY_FILTER_VALUE ? !id : id === value
                      }
                  },
                  {
                      title: 'Зачисление',
                      dataIndex: 'creditAccountId',
                      key: 'creditAccountId',
                      filters: creditFilters,
                      onFilter: (value: string, record: Record<string, unknown>) => {
                          const id = (record as unknown as Transaction).creditAccountId
                          return value === EMPTY_FILTER_VALUE ? !id : id === value
                      }
                  }
              ]
            : []),
        { title: '', key: 'action', width: 160, align: 'right' as const }
    ]
    return baseColumns
})

function openCreate() {
    editingTransaction.value = null
    drawerOpen.value = true
}

function defaultTransactionInitials(): Partial<TransactionFormValues> {
    return { occurredAt: new Date().toISOString().slice(0, 10) }
}

function openEdit(record: Transaction) {
    editingTransaction.value = record
    drawerOpen.value = true
}

async function handleFormSubmit(values: TransactionFormValues) {
    const budgetId = budgetStore.currentBudgetId
    const userId = sessionStore.user?.id
    if (!budgetId || !userId) return
    const amountStr = String(values.amount)
    const debitId = values.debitAccountId || undefined
    const creditId = values.creditAccountId || undefined
    const categoryId = values.categoryId || undefined
    const description = values.description?.trim() || null
    try {
        if (editingTransaction.value) {
            await updateTransaction(editingTransaction.value.id, {
                type: values.type,
                debitAccountId: debitId ?? null,
                creditAccountId: creditId ?? null,
                categoryId: categoryId ?? null,
                amount: amountStr,
                occurredAt: values.occurredAt,
                description,
                updatedById: userId
            })
            transactionStore.setTransaction({
                ...editingTransaction.value,
                type: values.type,
                debitAccountId: debitId ?? null,
                creditAccountId: creditId ?? null,
                categoryId: categoryId ?? null,
                amount: amountStr,
                occurredAt: values.occurredAt,
                description,
                updatedById: userId
            } as Transaction)
            message.success('Транзакция обновлена')
        } else {
            const created = await createTransaction({
                type: values.type,
                budgetId,
                debitAccountId: debitId ?? null,
                creditAccountId: creditId ?? null,
                categoryId: categoryId ?? null,
                amount: amountStr,
                occurredAt: values.occurredAt,
                description,
                createdById: userId
            })
            transactionStore.setTransaction(created as Transaction)
            message.success('Транзакция создана')
        }
        drawerOpen.value = false
    } catch {
        message.error('Ошибка сохранения')
    }
}

async function handleDelete(record: Transaction) {
    const ok = await confirm({
        title: 'Удалить транзакцию?',
        content: `Транзакция от ${formatDate(record.occurredAt)} на сумму ${formatRubles(record.amount, { maxFractionDigits: 0 })} будет удалена.`,
        type: 'warning',
        positiveText: 'Удалить'
    })
    if (!ok) return
    try {
        await deleteTransaction(record.id)
        transactionStore.removeTransaction(record.id)
        message.success('Транзакция удалена')
    } catch {
        message.error('Не удалось удалить транзакцию')
    }
}

async function load() {
    const budgetId = budgetStore.currentBudgetId
    if (!budgetId) return
    await Promise.all([
        accountStore.fetchAccounts(budgetId),
        categoryStore.fetchCategories(budgetId),
        transactionStore.fetchTransactions(budgetId)
    ])
}

const { loading, error } = usePageData(load, {
    watchSources: [() => budgetStore.currentBudgetId]
})

const currentMonth = getCurrentMonth()
</script>

<template>
    <div class="transactions-page">
        <ThePageHeader title="Транзакции">
            <template #extra>
                <TheCreateButton
                    v-if="hasBudget"
                    label="Создать транзакцию"
                    @click="openCreate"
                />
            </template>
        </ThePageHeader>

        <ThePageDataBoundary
            :loading="loading"
            :has-budget="hasBudget"
            :error="error"
        >
            <TheSpendingPulseChart
                v-if="transactionStore.transactions.length > 0"
                :transactions="transactionStore.transactions"
                :month="currentMonth"
            />
            <TheTable
                :columns="columns"
                :data-source="transactionStore.transactions"
                :loading="loading"
                row-key="id"
                :action-handlers="{
                    onEdit: (r) => openEdit(r as unknown as Transaction),
                    onDelete: (r) => handleDelete(r as unknown as Transaction)
                }"
            >
                <template #bodyCell="{ column, record }">
                    <template v-if="column?.key === 'occurredAt'">
                        {{ formatDate((record as Transaction).occurredAt) }}
                    </template>
                    <template v-else-if="column?.key === 'amount'">
                        <span
                            :class="[
                                'transactions-page__amount',
                                (record as Transaction).type === 'expense' && 'transactions-page__amount_expense',
                                (record as Transaction).type === 'income' && 'transactions-page__amount_income'
                            ]"
                        >
                            {{
                                (record as Transaction).type === 'expense'
                                    ? '− '
                                    : (record as Transaction).type === 'income'
                                      ? '+ '
                                      : ''
                            }}{{ formatRubles((record as Transaction).amount, { maxFractionDigits: 0 }) }}
                        </span>
                    </template>
                    <template v-else-if="column?.key === 'debitAccountId'">
                        {{
                            (record as Transaction).debitAccountId
                                ? accountName((record as Transaction).debitAccountId!)
                                : '—'
                        }}
                    </template>
                    <template v-else-if="column?.key === 'creditAccountId'">
                        {{
                            (record as Transaction).creditAccountId
                                ? accountName((record as Transaction).creditAccountId!)
                                : '—'
                        }}
                    </template>
                    <template v-else-if="column?.key === 'categoryId'">
                        {{
                            (record as Transaction).categoryId ? categoryName((record as Transaction).categoryId!) : '—'
                        }}
                    </template>
                    <template v-else-if="column?.key === 'description'">
                        <span class="transactions-page__cell-description">
                            {{ (record as Transaction).description ?? '—' }}
                        </span>
                    </template>
                </template>
            </TheTable>
        </ThePageDataBoundary>

        <QuickTransactionFab />

        <TheDrawer
            v-model:open="drawerOpen"
            :title="editingTransaction ? 'Редактировать транзакцию' : 'Создать транзакцию'"
            width="400"
        >
            <TransactionForm
                :key="editingTransaction?.id ?? 'new'"
                :account-options="accountOptions"
                :category-options="categoryOptions"
                :initial-values="
                    editingTransaction
                        ? {
                              type: editingTransaction.type,
                              debitAccountId: editingTransaction.debitAccountId ?? '',
                              creditAccountId: editingTransaction.creditAccountId ?? '',
                              categoryId: editingTransaction.categoryId ?? '',
                              amount: parseFloat(editingTransaction.amount) || 0,
                              occurredAt: editingTransaction.occurredAt.slice(0, 10),
                              description: editingTransaction.description ?? ''
                          }
                        : defaultTransactionInitials()
                "
                @submit="handleFormSubmit"
            />
        </TheDrawer>
    </div>
</template>

<style scoped>
.transactions-page {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-height: 0;
}

.transactions-page__amount_expense {
    color: var(--color-semantic-error);
}

.transactions-page__amount_income {
    color: var(--color-semantic-success);
}

.transactions-page__cell-description {
    color: var(--color-text-secondary);
}
</style>
