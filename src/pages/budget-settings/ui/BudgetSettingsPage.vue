<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { BudgetForm } from '@/features/budget/budget-form'
import type { BudgetFormValues } from '@/features/budget/budget-form'
import { InviteForm } from '@/features/budget-invitation/invite-form'
import type { InviteFormValues } from '@/features/budget-invitation/invite-form'

import { useBudgetStore } from '@/entities/budget'
import { updateBudget, deleteBudget } from '@/entities/budget/api'
import type { BudgetInvitation } from '@/entities/budget-invitation'
import { useBudgetInvitationStore } from '@/entities/budget-invitation'
import type { BudgetMember } from '@/entities/budget-member'
import { useBudgetMemberStore } from '@/entities/budget-member'
import { useSessionStore } from '@/entities/session'

import { toApiError } from '@/shared/api/errors'
import { ROUTE_NAMES } from '@/shared/config/router'
import { BUDGET_ROLE_OPTIONS } from '@/shared/lib/budget-role'
import { confirm } from '@/shared/lib/confirm'
import { message } from '@/shared/lib/message'
import { TheButton, TheCreateButton, TheModal, ThePageHeader, TheSpin, TheTable } from '@/shared/ui'

const route = useRoute()
const router = useRouter()
const budgetStore = useBudgetStore()
const invitationStore = useBudgetInvitationStore()
const memberStore = useBudgetMemberStore()
const sessionStore = useSessionStore()

const budgetId = computed(() => route.params.id as string)
const budget = computed(() => budgetStore.budgets.find((b) => b.id === budgetId.value) ?? null)
const isOwner = computed(() => budget.value?.role === 'owner')
const isCurrent = computed(() => budgetStore.currentBudgetId === budgetId.value)

const loading = ref(true)
const activeTab = ref('settings')
const inviteModalOpen = ref(false)
const updatingMemberId = ref<string | null>(null)

const memberRoleOptions = BUDGET_ROLE_OPTIONS.filter((o) => o.value !== 'owner')

const inviteColumns = [
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Роль', dataIndex: 'role', key: 'role' },
    { title: 'Статус', dataIndex: 'status', key: 'status' },
    { title: '', key: 'action', width: 100, align: 'right' as const }
]

const memberColumns = [
    { title: 'Участник', key: 'user' },
    { title: 'Роль', key: 'role', width: 180 },
    { title: '', key: 'action', width: 80, align: 'right' as const }
]

const roleLabels: Record<string, string> = {
    viewer: 'Наблюдатель',
    editor: 'Редактор',
    owner: 'Владелец'
}
const statusLabels: Record<string, string> = {
    pending: 'Ожидает',
    accepted: 'Принято',
    rejected: 'Отклонено'
}

async function load() {
    if (!budgetId.value) return
    loading.value = true
    try {
        await Promise.all([
            budgetStore.ensureBudgetsLoaded(),
            invitationStore.fetchBudgetInvitations(budgetId.value),
            memberStore.fetchBudgetMembers(budgetId.value)
        ])
    } finally {
        loading.value = false
    }
}

onMounted(load)
watch(budgetId, (id) => id && load())

async function handleBudgetSave(values: BudgetFormValues) {
    if (!budget.value) return
    try {
        const updated = await updateBudget(budgetId.value, values)
        budgetStore.setBudget({ ...budget.value, ...updated })
        message.success('Изменения сохранены')
    } catch {
        message.error('Не удалось сохранить изменения')
    }
}

function handleSetCurrent() {
    budgetStore.setCurrentBudget(budgetId.value)
    message.success('Текущий бюджет изменён')
}

async function handleBudgetDelete() {
    if (!budget.value) return
    const ok = await confirm({
        title: 'Удалить бюджет?',
        content: `«${budget.value.name}» и все связанные данные будут удалены.`,
        type: 'warning',
        positiveText: 'Удалить'
    })
    if (!ok) return
    try {
        await deleteBudget(budgetId.value)
        budgetStore.removeBudget(budgetId.value)
        message.success('Бюджет удалён')
        router.push({ name: ROUTE_NAMES.BUDGETS })
    } catch {
        message.error('Не удалось удалить бюджет')
    }
}

function isCurrentUser(member: BudgetMember) {
    return sessionStore.user?.id === member.userId
}

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
    } catch (err) {
        const apiErr = toApiError(err)
        if (apiErr.code === 'ALREADY_INVITED') {
            message.error('Этот пользователь уже приглашён')
        } else if (apiErr.code === 'ALREADY_BUDGET_MEMBER') {
            message.error('Этот пользователь уже участник бюджета')
        } else {
            message.error('Не удалось отправить приглашение')
        }
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

async function handleMemberRoleChange(member: BudgetMember, role: string) {
    updatingMemberId.value = member.id
    try {
        await memberStore.updateMember(member.id, role as BudgetMember['role'])
        message.success('Роль обновлена')
    } catch (err) {
        const apiErr = toApiError(err)
        if (apiErr.code === 'LAST_OWNER_PROTECTED') {
            message.error('Нельзя понизить роль последнего владельца бюджета')
        } else {
            message.error('Не удалось изменить роль')
        }
    } finally {
        updatingMemberId.value = null
    }
}

async function handleMemberRemove(member: BudgetMember) {
    const name = `${member.User.firstName} ${member.User.lastName}`
    const confirmed = await confirm({ title: `Удалить участника ${name} из бюджета?` })
    if (!confirmed) return
    try {
        await memberStore.removeMember(member.id)
        message.success('Участник удалён')
    } catch (err) {
        const apiErr = toApiError(err)
        if (apiErr.code === 'LAST_OWNER_PROTECTED') {
            message.error('Нельзя удалить последнего владельца бюджета')
        } else {
            message.error('Не удалось удалить участника')
        }
    }
}
</script>

<template>
    <div class="budget-settings-page">
        <ThePageHeader :title="budget?.name ?? '…'" />

        <TheSpin :spinning="loading">
            <template v-if="budget">
                <a-tabs v-model:active-key="activeTab">
                    <a-tab-pane
                        key="settings"
                        tab="Настройки"
                    >
                        <div class="budget-settings-page__tab-content">
                            <BudgetForm
                                :key="budget.id"
                                :initial-values="{
                                    name: budget.name,
                                    currency: budget.currency,
                                    initialBalance: budget.initialBalance
                                }"
                                @submit="handleBudgetSave"
                            />
                            <TheButton
                                v-if="!isCurrent"
                                block
                                @click="handleSetCurrent"
                            >
                                Сделать текущим
                            </TheButton>
                            <TheButton
                                v-if="isOwner"
                                danger
                                block
                                class="budget-settings-page__delete-btn"
                                @click="handleBudgetDelete"
                            >
                                Удалить бюджет
                            </TheButton>
                        </div>
                    </a-tab-pane>

                    <a-tab-pane
                        key="members"
                        tab="Участники"
                    >
                        <div class="budget-settings-page__tab-content">
                            <TheTable
                                :columns="memberColumns"
                                :data-source="memberStore.members"
                                :loading="loading"
                                row-key="id"
                            >
                                <template #bodyCell="{ column, record }">
                                    <template v-if="column?.key === 'user'">
                                        <div class="budget-settings-page__member-user">
                                            <span
                                                >{{ (record as BudgetMember).User.firstName }}
                                                {{ (record as BudgetMember).User.lastName }}</span
                                            >
                                            <span
                                                v-if="isCurrentUser(record as BudgetMember)"
                                                class="budget-settings-page__you-tag"
                                                >Вы</span
                                            >
                                            <span class="budget-settings-page__member-email">{{
                                                (record as BudgetMember).User.email
                                            }}</span>
                                        </div>
                                    </template>
                                    <template v-else-if="column?.key === 'role'">
                                        <a-select
                                            v-if="isOwner && (record as BudgetMember).role !== 'owner'"
                                            :value="(record as BudgetMember).role"
                                            :options="memberRoleOptions"
                                            :loading="updatingMemberId === (record as BudgetMember).id"
                                            size="small"
                                            style="width: 160px"
                                            @change="handleMemberRoleChange(record as BudgetMember, $event as string)"
                                        />
                                        <span v-else>{{
                                            roleLabels[(record as BudgetMember).role] ?? (record as BudgetMember).role
                                        }}</span>
                                    </template>
                                    <template v-else-if="column?.key === 'action'">
                                        <TheButton
                                            v-if="isOwner && !isCurrentUser(record as BudgetMember)"
                                            type="link"
                                            size="small"
                                            danger
                                            @click="handleMemberRemove(record as BudgetMember)"
                                        >
                                            Удалить
                                        </TheButton>
                                    </template>
                                </template>
                            </TheTable>
                        </div>
                    </a-tab-pane>

                    <a-tab-pane
                        key="invitations"
                        tab="Приглашения"
                    >
                        <div class="budget-settings-page__tab-content">
                            <div
                                v-if="isOwner"
                                class="budget-settings-page__toolbar"
                            >
                                <TheCreateButton
                                    label="Пригласить"
                                    size="small"
                                    @click="inviteModalOpen = true"
                                />
                            </div>
                            <TheTable
                                :columns="inviteColumns"
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
                        </div>
                    </a-tab-pane>
                </a-tabs>
            </template>
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
            <InviteForm @submit="handleInviteSubmit" />
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

.budget-settings-page__tab-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 16px;
    max-width: 480px;
}

.budget-settings-page__toolbar {
    display: flex;
    justify-content: flex-end;
}

.budget-settings-page__delete-btn {
    margin-top: 8px;
}

.budget-settings-page__no-budget {
    margin: 0;
    color: var(--color-text-secondary);
}

.budget-settings-page__member-user {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
}

.budget-settings-page__member-email {
    color: var(--color-text-secondary);
    font-size: 0.85em;
    margin-left: 2px;
}

.budget-settings-page__you-tag {
    font-size: 0.75em;
    padding: 1px 6px;
    border-radius: 10px;
    background: var(--color-primary-light, #e6f4ff);
    color: var(--color-primary, #1677ff);
    line-height: 1.5;
}
</style>
