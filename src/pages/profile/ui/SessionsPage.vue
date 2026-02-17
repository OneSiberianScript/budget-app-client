<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { getSessions, revokeSession, revokeAllSessions } from '@/entities/session'
import type { AuthSession } from '@/entities/session'

import { confirm } from '@/shared/lib/confirm'
import { message } from '@/shared/lib/message'
import { TheButton, TheSpin, TheTable } from '@/shared/ui'

const sessions = ref<AuthSession[]>([])
const loading = ref(true)

const columns = [
    { title: 'Устройство / информация', dataIndex: 'deviceInfo', key: 'deviceInfo' },
    { title: 'Дата входа', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
    { title: '', key: 'action', width: 120, align: 'right' as const }
]

function formatDate(iso: string) {
    return new Date(iso).toLocaleString('ru-RU')
}

async function load() {
    loading.value = true
    try {
        sessions.value = await getSessions()
    } finally {
        loading.value = false
    }
}

async function handleRevoke(record: AuthSession): Promise<void> {
    if (record.current) {
        message.warning('Текущую сессию нельзя завершить отсюда. Выйдите из аккаунта.')
        return
    }
    const ok = await confirm({
        title: 'Завершить сессию?',
        content: 'Вход с этого устройства будет отменён.',
        type: 'warning',
        positiveText: 'Завершить'
    })
    if (!ok) return
    try {
        await revokeSession(record.id)
        sessions.value = sessions.value.filter((s) => s.id !== record.id)
        message.success('Сессия завершена')
    } catch {
        message.error('Не удалось завершить сессию')
    }
}

async function handleRevokeAll() {
    const ok = await confirm({
        title: 'Завершить все другие сессии?',
        content: 'Вход на всех остальных устройствах будет отменён. Текущая сессия останется активной.',
        type: 'warning',
        positiveText: 'Завершить везде'
    })
    if (!ok) return
    try {
        await revokeAllSessions()
        await load()
        message.success('Остальные сессии завершены')
    } catch {
        message.error('Не удалось завершить сессии')
    }
}

onMounted(load)
</script>

<template>
    <div class="sessions-page">
        <div class="sessions-page__toolbar">
            <h1 class="sessions-page__title">Сессии</h1>
            <TheButton
                type="primary"
                danger
                :disabled="sessions.length <= 1"
                @click="handleRevokeAll"
            >
                Завершить все кроме текущей
            </TheButton>
        </div>

        <TheSpin :spinning="loading">
            <TheTable
                :columns="columns"
                :data-source="sessions"
                :loading="loading"
                row-key="id"
            >
                <template #bodyCell="{ column, record }">
                    <template v-if="column?.key === 'deviceInfo'">
                        <span>
                            {{ record.deviceInfo ?? 'Не указано' }}
                            <a-tag
                                v-if="record.current"
                                color="blue"
                                class="sessions-page__current-tag"
                            >
                                Текущая
                            </a-tag>
                        </span>
                    </template>
                    <template v-else-if="column?.key === 'createdAt'">
                        {{ formatDate(record.createdAt) }}
                    </template>
                    <template v-else-if="column?.key === 'action'">
                        <TheButton
                            v-if="!record.current"
                            type="link"
                            size="small"
                            danger
                            @click="handleRevoke(record as AuthSession)"
                        >
                            Завершить
                        </TheButton>
                        <span
                            v-else
                            class="sessions-page__current"
                        >
                            —
                        </span>
                    </template>
                </template>
            </TheTable>
        </TheSpin>
    </div>
</template>

<style scoped>
.sessions-page {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-height: 0;
}

.sessions-page__toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
}

.sessions-page__title {
    margin: 0;
    font-size: 1.25rem;
}

.sessions-page__current-tag {
    margin-left: 8px;
}

.sessions-page__current {
    color: var(--color-text-secondary, #999);
}
</style>
