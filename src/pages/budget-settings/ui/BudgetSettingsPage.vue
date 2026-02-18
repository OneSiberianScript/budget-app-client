<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

import { InviteForm } from '@/features/budget-invitation/invite-form'
import type { InviteFormValues } from '@/features/budget-invitation/invite-form'

import { useBudgetStore } from '@/entities/budget'
import type { BudgetInvitation } from '@/entities/budget-invitation'
import { useBudgetInvitationStore } from '@/entities/budget-invitation'

import { message } from '@/shared/lib/message'
import { TheButton, TheModal, ThePageHeader, TheSpin, TheTable } from '@/shared/ui'

const route = useRoute()
const budgetStore = useBudgetStore()
const invitationStore = useBudgetInvitationStore()

const budgetId = computed(() => route.params.id as string)
const budget = computed(() => budgetStore.budgets.find((b) => b.id === budgetId.value) ?? null)
const isOwner = computed(
    () => budgetStore.currentBudgetId === budgetId.value && budgetStore.currentBudgetRole === 'owner'
)

const loading = ref(true)
const inviteModalOpen = ref(false)

const columns = [
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Роль', dataIndex: 'role', key: 'role' },
    { title: 'Статус', dataIndex: 'status', key: 'status' },
    { title: '', key: 'action', width: 100, align: 'right' as const }
]

const roleLabels: Record<string, string> = {
    viewer: 'Наблюдатель',
    editor: 'Редактор',
    owner: 'Владелец'
}
const statusLabels: Record<string, string> = {
    pending: 'Ожидает',
    accepted: 'Принято',
    expired: 'Истекло'
}

async function load() {
    if (!budgetId.value) return
    loading.value = true
    try {
        await Promise.all([budgetStore.fetchBudgets(), invitationStore.fetchBudgetInvitations(budgetId.value)])
    } finally {
        loading.value = false
    }
}

onMounted(load)
watch(budgetId, (id) => id && load())

async function handleInviteSubmit(values: InviteFormValues) {
    if (!budgetId.value) return
    try {
        await invitationStore.createInvitation({
            budgetId: budgetId.value,
            email: values.email,
            role: values.role
        })
        message.success('Приглашение отправлено')
        inviteModalOpen.value = false
    } catch {
        message.error('Не удалось отправить приглашение')
    }
}

async function handleRevoke(inv: BudgetInvitation) {
    if (inv.status !== 'pending') return
    try {
        await invitationStore.revokeInvitation(inv.id)
        message.success('Приглашение отменено')
    } catch {
        message.error('Не удалось отменить приглашение')
    }
}
</script>

<template>
    <div class="budget-settings-page">
        <ThePageHeader :title="`Настройки: ${budget?.name ?? '…'}`" />

        <TheSpin :spinning="loading">
            <section
                v-if="budget"
                class="budget-settings-page__section"
            >
                <h2 class="budget-settings-page__section-title">Приглашения</h2>
                <div class="budget-settings-page__toolbar">
                    <TheButton
                        v-if="isOwner"
                        type="primary"
                        size="small"
                        @click="inviteModalOpen = true"
                    >
                        Пригласить
                    </TheButton>
                </div>
                <TheTable
                    :columns="columns"
                    :data-source="invitationStore.invitations"
                    :loading="loading"
                    row-key="id"
                >
                    <template #bodyCell="{ column, record }">
                        <template v-if="column?.key === 'role'">
                            {{ roleLabels[record.role] ?? record.role }}
                        </template>
                        <template v-else-if="column?.key === 'status'">
                            {{ statusLabels[record.status] ?? record.status }}
                        </template>
                        <template v-else-if="column?.key === 'action'">
                            <TheButton
                                v-if="record.status === 'pending' && isOwner"
                                type="link"
                                size="small"
                                danger
                                @click="handleRevoke(record as BudgetInvitation)"
                            >
                                Отменить
                            </TheButton>
                        </template>
                    </template>
                </TheTable>
            </section>
            <p
                v-else-if="!loading"
                class="budget-settings-page__no-budget"
            >
                Бюджет не найден.
            </p>
        </TheSpin>

        <TheModal
            v-model="inviteModalOpen"
            title="Пригласить в бюджет"
            preset="dialog"
            size="small"
        >
            <InviteForm
                :key="inviteModalOpen ? 'open' : 'closed'"
                @submit="handleInviteSubmit"
            />
        </TheModal>
    </div>
</template>

<style scoped>
.budget-settings-page {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-height: 0;
}

.budget-settings-page__section {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.budget-settings-page__section-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
}

.budget-settings-page__toolbar {
    display: flex;
    justify-content: flex-end;
}

.budget-settings-page__no-budget {
    margin: 0;
    color: var(--color-text-secondary, #666);
}
</style>
