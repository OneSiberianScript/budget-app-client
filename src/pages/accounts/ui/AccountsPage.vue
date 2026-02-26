<script setup lang="ts">
import { ref, computed } from 'vue'

import { AccountForm } from '@/features/account/account-form'
import type { AccountFormValues } from '@/features/account/account-form'

import { getBankLogoUrl, useAccountStore } from '@/entities/account'
import type { Account } from '@/entities/account'
import { createAccount, updateAccount, deleteAccount } from '@/entities/account/api'
import { useBudgetStore } from '@/entities/budget'

import { confirm } from '@/shared/lib/confirm'
import { formatRubles } from '@/shared/lib/format-money'
import { message } from '@/shared/lib/message'
import { usePageData } from '@/shared/lib/usePageData'
import { TheCreateButton, TheDrawer, ThePageDataBoundary, ThePageHeader, TheTable } from '@/shared/ui'

const budgetStore = useBudgetStore()
const accountStore = useAccountStore()

const drawerOpen = ref(false)
const editingAccount = ref<Account | null>(null)

const hasBudget = computed(() => !!budgetStore.currentBudgetId)
const accountTypeLabels: Record<string, string> = {
    account: 'Счёт',
    card: 'Карта',
    cash: 'Наличные'
}

const columns = [
    { title: '', dataIndex: 'bank', key: 'bank', width: 40 },
    { title: 'Название', dataIndex: 'name', key: 'name' },
    { title: 'Тип', dataIndex: 'type', key: 'type', width: 100 },
    { title: 'Баланс', dataIndex: 'currentBalance', key: 'currentBalance', width: 120 },
    { title: '', key: 'action', width: 160, align: 'right' as const }
]

function openCreate() {
    editingAccount.value = null
    drawerOpen.value = true
}

function openEdit(record: Account) {
    editingAccount.value = record
    drawerOpen.value = true
}

async function handleFormSubmit(values: AccountFormValues) {
    const budgetId = budgetStore.currentBudgetId
    if (!budgetId) return
    try {
        if (editingAccount.value) {
            await updateAccount(editingAccount.value.id, values)
            accountStore.setAccount({ ...editingAccount.value, ...values } as Account)
            message.success('Счёт обновлён')
        } else {
            const created = await createAccount({ budgetId, ...values })
            accountStore.setAccount(created as Account)
            message.success('Счёт создан')
        }
        drawerOpen.value = false
    } catch {
        message.error('Ошибка сохранения')
    }
}

async function handleDelete(record: Account) {
    const ok = await confirm({
        title: 'Удалить счёт?',
        content: `«${record.name}» будет удалён.`,
        type: 'warning',
        positiveText: 'Удалить'
    })
    if (!ok) return
    try {
        await deleteAccount(record.id)
        accountStore.removeAccount(record.id)
        message.success('Счёт удалён')
    } catch {
        message.error('Не удалось удалить счёт')
    }
}

async function load() {
    const budgetId = budgetStore.currentBudgetId
    if (!budgetId) return
    await accountStore.fetchAccounts(budgetId)
}

const { loading, error } = usePageData(load, {
    watchSources: [() => budgetStore.currentBudgetId]
})
</script>

<template>
    <div class="accounts-page">
        <ThePageHeader title="Счета">
            <template #extra>
                <TheCreateButton
                    v-if="hasBudget"
                    label="Создать счёт"
                    @click="openCreate"
                />
            </template>
        </ThePageHeader>

        <ThePageDataBoundary
            :loading="loading"
            :has-budget="hasBudget"
            :error="error"
        >
            <TheTable
                :columns="columns"
                :data-source="accountStore.accounts"
                :loading="loading"
                row-key="id"
                :action-handlers="{
                    onEdit: (r) => openEdit(r as unknown as Account),
                    onDelete: (r) => handleDelete(r as unknown as Account)
                }"
            >
                <template #bodyCell="{ column, record }">
                    <template v-if="column?.key === 'bank'">
                        <span class="accounts-page__bank-cell">
                            <img
                                v-if="getBankLogoUrl((record as Account).bank)"
                                :src="getBankLogoUrl((record as Account).bank)!"
                                alt=""
                                class="accounts-page__bank-logo"
                            />
                            <template v-else>{{ (record as Account).bank ?? '—' }}</template>
                        </span>
                    </template>
                    <template v-else-if="column?.key === 'type'">
                        {{ accountTypeLabels[(record as Account).type] ?? (record as Account).type }}
                    </template>
                    <template v-else-if="column?.key === 'currentBalance'">
                        {{ formatRubles((record as Account).currentBalance) }}
                    </template>
                </template>
            </TheTable>
        </ThePageDataBoundary>

        <TheDrawer
            v-model:open="drawerOpen"
            :title="editingAccount ? 'Редактировать счёт' : 'Создать счёт'"
            width="400"
        >
            <AccountForm
                :key="editingAccount?.id ?? 'new'"
                :initial-values="
                    editingAccount
                        ? {
                              name: editingAccount.name,
                              type: editingAccount.type,
                              initialBalance: editingAccount.initialBalance ?? '',
                              bank: editingAccount.bank
                          }
                        : undefined
                "
                @submit="handleFormSubmit"
            />
        </TheDrawer>
    </div>
</template>

<style scoped>
.accounts-page {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-height: 0;
}

.accounts-page__bank-cell {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.accounts-page__bank-logo {
    display: block;
    width: 24px;
    height: 24px;
    object-fit: contain;
}
</style>
