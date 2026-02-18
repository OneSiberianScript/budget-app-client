<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { BudgetForm } from '@/features/budget/budget-form'
import type { BudgetFormValues } from '@/features/budget/budget-form'

import { useBudgetStore } from '@/entities/budget'
import type { Budget } from '@/entities/budget'
import { createBudget, updateBudget, deleteBudget } from '@/entities/budget/api'

import { ROUTE_NAMES } from '@/shared/config/router'
import { confirm } from '@/shared/lib/confirm'
import { message } from '@/shared/lib/message'
import { TheButton, TheDrawer, ThePageHeader, TheSpin, TheTable } from '@/shared/ui'

const budgetStore = useBudgetStore()

const drawerOpen = ref(false)
const editingBudget = ref<Budget | null>(null)
const loading = ref(true)

const columns = [
    { title: 'Название', dataIndex: 'name', key: 'name' },
    { title: '', key: 'action', width: 220, align: 'right' as const }
]

function openCreate() {
    editingBudget.value = null
    drawerOpen.value = true
}

function openEdit(record: Budget) {
    editingBudget.value = record
    drawerOpen.value = true
}

async function handleFormSubmit(values: BudgetFormValues) {
    try {
        if (editingBudget.value) {
            await updateBudget(editingBudget.value.id, values)
            budgetStore.setBudget({ ...editingBudget.value, ...values } as Budget)
            message.success('Бюджет обновлён')
        } else {
            const created = await createBudget(values)
            budgetStore.setBudget(created as Budget)
            message.success('Бюджет создан')
        }
        drawerOpen.value = false
    } catch {
        message.error('Ошибка сохранения')
    }
}

async function handleDelete(record: Budget) {
    const ok = await confirm({
        title: 'Удалить бюджет?',
        content: `«${record.name}» и все связанные данные будут удалены.`,
        type: 'warning',
        positiveText: 'Удалить'
    })
    if (!ok) return
    try {
        await deleteBudget(record.id)
        budgetStore.removeBudget(record.id)
        message.success('Бюджет удалён')
    } catch {
        message.error('Не удалось удалить бюджет')
    }
}

async function load() {
    loading.value = true
    try {
        await budgetStore.fetchBudgets()
    } finally {
        loading.value = false
    }
}

onMounted(load)
</script>

<template>
    <div class="budgets-page">
        <ThePageHeader title="Бюджеты">
            <template #extra>
                <TheButton
                    type="primary"
                    @click="openCreate"
                >
                    Создать бюджет
                </TheButton>
            </template>
        </ThePageHeader>

        <TheSpin :spinning="loading">
            <TheTable
                :columns="columns"
                :data-source="budgetStore.budgets"
                :loading="loading"
                row-key="id"
            >
                <template #bodyCell="{ column, record }">
                    <template v-if="column?.key === 'action'">
                        <span class="budgets-page__actions">
                            <router-link
                                :to="{ name: ROUTE_NAMES.BUDGET_SETTINGS, params: { id: (record as Budget).id } }"
                                class="budgets-page__link"
                            >
                                Настройки
                            </router-link>
                            <TheButton
                                type="link"
                                size="small"
                                @click="openEdit(record as Budget)"
                            >
                                Изменить
                            </TheButton>
                            <TheButton
                                type="link"
                                size="small"
                                danger
                                @click="handleDelete(record as Budget)"
                            >
                                Удалить
                            </TheButton>
                        </span>
                    </template>
                </template>
            </TheTable>
        </TheSpin>

        <TheDrawer
            v-model:open="drawerOpen"
            :title="editingBudget ? 'Редактировать бюджет' : 'Создать бюджет'"
            width="400"
        >
            <BudgetForm
                :key="editingBudget?.id ?? 'new'"
                :initial-values="
                    editingBudget
                        ? {
                              name: editingBudget.name,
                              currency: editingBudget.currency,
                              initialBalance: editingBudget.initialBalance
                          }
                        : undefined
                "
                @submit="handleFormSubmit"
            />
        </TheDrawer>
    </div>
</template>

<style scoped>
.budgets-page {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-height: 0;
}

.budgets-page__actions {
    display: flex;
    gap: 8px;
}
</style>
