<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

import { AccountForm } from '@/features/account/account-form'
import type { AccountFormValues } from '@/features/account/account-form'

import { useAccountStore } from '@/entities/account'
import type { Account } from '@/entities/account'
import { createAccount, updateAccount, deleteAccount } from '@/entities/account/api'
import { useBudgetStore } from '@/entities/budget'

import { confirm } from '@/shared/lib/confirm'
import { message } from '@/shared/lib/message'
import { TheButton, TheDrawer, TheEmpty, ThePageHeader, TheSpin, TheTable } from '@/shared/ui'

const budgetStore = useBudgetStore()
const accountStore = useAccountStore()

const drawerOpen = ref(false)
const editingAccount = ref<Account | null>(null)
const loading = ref(true)

const hasBudget = computed(() => !!budgetStore.currentBudgetId)
const accountTypeLabels: Record<string, string> = {
    cash: 'Наличные',
    bank: 'Банк',
    credit: 'Кредит',
    saving: 'Накопительный'
}

const columns = [
    { title: 'Название', dataIndex: 'name', key: 'name' },
    { title: 'Тип', dataIndex: 'type', key: 'type', width: 120 },
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
    if (!budgetId) {
        loading.value = false
        return
    }
    loading.value = true
    try {
        await accountStore.fetchAccounts(budgetId)
    } finally {
        loading.value = false
    }
}

onMounted(load)
watch(() => budgetStore.currentBudgetId, load)
</script>

<template>
    <div class="accounts-page">
        <ThePageHeader title="Счета">
            <template #extra>
                <TheButton
                    v-if="hasBudget"
                    type="primary"
                    @click="openCreate"
                >
                    Создать счёт
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
                    :data-source="accountStore.accounts"
                    :loading="loading"
                    row-key="id"
                >
                    <template #bodyCell="{ column, record }">
                        <template v-if="column?.key === 'type'">
                            {{ accountTypeLabels[(record as Account).type] ?? (record as Account).type }}
                        </template>
                        <template v-else-if="column?.key === 'action'">
                            <span class="accounts-page__actions">
                                <TheButton
                                    type="link"
                                    size="small"
                                    @click="openEdit(record as Account)"
                                >
                                    Изменить
                                </TheButton>
                                <TheButton
                                    type="link"
                                    size="small"
                                    danger
                                    @click="handleDelete(record as Account)"
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
            :title="editingAccount ? 'Редактировать счёт' : 'Создать счёт'"
            width="400"
        >
            <AccountForm
                :key="editingAccount?.id ?? 'new'"
                :initial-values="editingAccount ? { name: editingAccount.name, type: editingAccount.type } : undefined"
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

.accounts-page__actions {
    display: flex;
    gap: 8px;
}
</style>
