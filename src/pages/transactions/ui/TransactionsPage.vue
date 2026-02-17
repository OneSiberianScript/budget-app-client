<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

import { TransactionForm } from '@/features/transaction/transaction-form'
import type { TransactionFormValues } from '@/features/transaction/transaction-form'

import { useAccountStore } from '@/entities/account'
import { useBudgetStore } from '@/entities/budget'
import { useCategoryStore } from '@/entities/category'
import { useTransactionStore } from '@/entities/transaction'
import type { Transaction } from '@/entities/transaction'
import { createTransaction, updateTransaction, deleteTransaction } from '@/entities/transaction/api'

import { confirm } from '@/shared/lib/confirm'
import { message } from '@/shared/lib/message'
import { TheButton, TheDrawer, TheEmpty, TheSpin, TheTable } from '@/shared/ui'

const budgetStore = useBudgetStore()
const accountStore = useAccountStore()
const categoryStore = useCategoryStore()
const transactionStore = useTransactionStore()

const drawerOpen = ref(false)
const editingTransaction = ref<Transaction | null>(null)
const loading = ref(true)

const hasBudget = computed(() => !!budgetStore.currentBudgetId)

const accountOptions = computed(() => accountStore.accounts.map((a) => ({ label: a.name, value: a.id })))
const categoryOptions = computed(() => categoryStore.categories.map((c) => ({ label: c.name, value: c.id })))

function accountName(id: string) {
    return accountStore.accounts.find((a) => a.id === id)?.name ?? id
}
function categoryName(id: string) {
    return categoryStore.categories.find((c) => c.id === id)?.name ?? id
}

function formatDate(dateStr: string) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const columns = [
    { title: 'Дата', dataIndex: 'date', key: 'date', width: 110 },
    { title: 'Сумма', dataIndex: 'amount', key: 'amount', width: 120 },
    { title: 'Счёт', dataIndex: 'accountId', key: 'accountId' },
    { title: 'Категория', dataIndex: 'categoryId', key: 'categoryId' },
    { title: 'Заметка', dataIndex: 'note', key: 'note', ellipsis: true },
    { title: '', key: 'action', width: 160, align: 'right' as const }
]

function openCreate() {
    editingTransaction.value = null
    drawerOpen.value = true
}

function defaultTransactionInitials(): Partial<TransactionFormValues> {
    return { date: new Date().toISOString().slice(0, 10) }
}

function openEdit(record: Transaction) {
    editingTransaction.value = record
    drawerOpen.value = true
}

async function handleFormSubmit(values: TransactionFormValues) {
    const budgetId = budgetStore.currentBudgetId
    if (!budgetId) return
    try {
        if (editingTransaction.value) {
            await updateTransaction(editingTransaction.value.id, {
                accountId: values.accountId,
                categoryId: values.categoryId,
                amount: values.amount,
                date: values.date,
                note: values.note
            })
            transactionStore.setTransaction({
                ...editingTransaction.value,
                accountId: values.accountId,
                categoryId: values.categoryId,
                amount: values.amount,
                date: values.date,
                note: values.note
            } as Transaction)
            message.success('Транзакция обновлена')
        } else {
            const created = await createTransaction({
                budgetId,
                accountId: values.accountId,
                categoryId: values.categoryId,
                amount: values.amount,
                date: values.date,
                note: values.note
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
        content: `Транзакция от ${formatDate(record.date)} на сумму ${record.amount} будет удалена.`,
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
    if (!budgetId) {
        loading.value = false
        return
    }
    loading.value = true
    try {
        await Promise.all([
            accountStore.fetchAccounts(budgetId),
            categoryStore.fetchCategories(budgetId),
            transactionStore.fetchTransactions(budgetId)
        ])
    } finally {
        loading.value = false
    }
}

onMounted(load)
watch(() => budgetStore.currentBudgetId, load)
</script>

<template>
    <div class="transactions-page">
        <div class="transactions-page__toolbar">
            <h1 class="transactions-page__title">Транзакции</h1>
            <TheButton
                v-if="hasBudget"
                type="primary"
                @click="openCreate"
            >
                Создать транзакцию
            </TheButton>
        </div>

        <TheSpin :spinning="loading">
            <template v-if="!hasBudget">
                <TheEmpty description="Выберите бюджет" />
            </template>
            <template v-else>
                <TheTable
                    :columns="columns"
                    :data-source="transactionStore.transactions"
                    :loading="loading"
                    row-key="id"
                >
                    <template #bodyCell="{ column, record }">
                        <template v-if="column?.key === 'date'">
                            {{ formatDate(record.date) }}
                        </template>
                        <template v-else-if="column?.key === 'amount'">
                            {{ record.amount }}
                        </template>
                        <template v-else-if="column?.key === 'accountId'">
                            {{ accountName(record.accountId) }}
                        </template>
                        <template v-else-if="column?.key === 'categoryId'">
                            {{ categoryName(record.categoryId) }}
                        </template>
                        <template v-else-if="column?.key === 'action'">
                            <span class="transactions-page__actions">
                                <a-button
                                    type="link"
                                    size="small"
                                    @click="openEdit(record as Transaction)"
                                >
                                    Изменить
                                </a-button>
                                <a-button
                                    type="link"
                                    size="small"
                                    danger
                                    @click="handleDelete(record as Transaction)"
                                >
                                    Удалить
                                </a-button>
                            </span>
                        </template>
                    </template>
                </TheTable>
            </template>
        </TheSpin>

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
                              accountId: editingTransaction.accountId,
                              categoryId: editingTransaction.categoryId,
                              amount: editingTransaction.amount,
                              date: editingTransaction.date,
                              note: editingTransaction.note
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

.transactions-page__toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
}

.transactions-page__title {
    margin: 0;
    font-size: 1.25rem;
}

.transactions-page__actions {
    display: flex;
    gap: 8px;
}
</style>
