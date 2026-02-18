<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

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
import { message } from '@/shared/lib/message'
import { TheButton, TheDrawer, TheEmpty, ThePageHeader, TheSpin, TheTable } from '@/shared/ui'

const budgetStore = useBudgetStore()
const accountStore = useAccountStore()
const categoryStore = useCategoryStore()
const sessionStore = useSessionStore()
const transactionStore = useTransactionStore()

const drawerOpen = ref(false)
const editingTransaction = ref<Transaction | null>(null)
const loading = ref(true)

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

function transactionTypeLabel(type: string) {
    const labels: Record<string, string> = { expense: 'Расход', income: 'Доход', transfer: 'Перевод' }
    return labels[type] ?? type
}

function formatDate(dateStr: string) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const columns = [
    { title: 'Тип', dataIndex: 'type', key: 'type', width: 90 },
    { title: 'Дата', dataIndex: 'occurredAt', key: 'occurredAt', width: 110 },
    { title: 'Сумма', dataIndex: 'amount', key: 'amount', width: 120 },
    { title: 'Счёт', dataIndex: 'accountId', key: 'accountId' },
    { title: 'Категория', dataIndex: 'categoryId', key: 'categoryId' },
    { title: '', key: 'action', width: 160, align: 'right' as const }
]

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
    try {
        if (editingTransaction.value) {
            await updateTransaction(editingTransaction.value.id, {
                type: values.type,
                accountId: values.accountId,
                categoryId: values.categoryId,
                amount: amountStr,
                occurredAt: values.occurredAt,
                updatedById: userId
            })
            transactionStore.setTransaction({
                ...editingTransaction.value,
                type: values.type,
                accountId: values.accountId,
                categoryId: values.categoryId,
                amount: amountStr,
                occurredAt: values.occurredAt,
                updatedById: userId
            } as Transaction)
            message.success('Транзакция обновлена')
        } else {
            const created = await createTransaction({
                type: values.type,
                budgetId,
                accountId: values.accountId,
                categoryId: values.categoryId,
                amount: amountStr,
                occurredAt: values.occurredAt,
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
        content: `Транзакция от ${formatDate(record.occurredAt)} на сумму ${record.amount} будет удалена.`,
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
    } catch {
        loading.value = false
    } finally {
        loading.value = false
    }
}

onMounted(load)
watch(() => budgetStore.currentBudgetId, load)
</script>

<template>
    <div class="transactions-page">
        <ThePageHeader title="Транзакции">
            <template #extra>
                <TheButton
                    v-if="hasBudget"
                    type="primary"
                    @click="openCreate"
                >
                    Создать транзакцию
                </TheButton>
            </template>
        </ThePageHeader>

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
                        <template v-if="column?.key === 'type'">
                            {{ transactionTypeLabel((record as Transaction).type) }}
                        </template>
                        <template v-else-if="column?.key === 'occurredAt'">
                            {{ formatDate((record as Transaction).occurredAt) }}
                        </template>
                        <template v-else-if="column?.key === 'amount'">
                            {{ (record as Transaction).amount }}
                        </template>
                        <template v-else-if="column?.key === 'accountId'">
                            {{ accountName(record.accountId) }}
                        </template>
                        <template v-else-if="column?.key === 'categoryId'">
                            {{ categoryName(record.categoryId) }}
                        </template>
                        <template v-else-if="column?.key === 'action'">
                            <span class="transactions-page__actions">
                                <TheButton
                                    type="link"
                                    size="small"
                                    @click="openEdit(record as Transaction)"
                                >
                                    Изменить
                                </TheButton>
                                <TheButton
                                    type="link"
                                    size="small"
                                    danger
                                    @click="handleDelete(record as Transaction)"
                                >
                                    Удалить
                                </TheButton>
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
                              type: editingTransaction.type,
                              accountId: editingTransaction.accountId,
                              categoryId: editingTransaction.categoryId,
                              amount: parseFloat(editingTransaction.amount) || 0,
                              occurredAt: editingTransaction.occurredAt.slice(0, 10)
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

.transactions-page__actions {
    display: flex;
    gap: 8px;
}
</style>
