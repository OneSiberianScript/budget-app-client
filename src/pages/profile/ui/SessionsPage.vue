<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import { getSessions, revokeSession, revokeAllSessions, useSessionStore } from '@/entities/session'
import type { SessionInfo } from '@/entities/session'

import { confirm } from '@/shared/lib/confirm'
import { message } from '@/shared/lib/message'
import { TheButton, ThePageHeader, TheSpin, TheTable, TheTag } from '@/shared/ui'

const sessionStore = useSessionStore()
const sessions = ref<SessionInfo[]>([])
const loading = ref(true)

/** Сессии с флагом текущей (вычисляется на фронте по sessionId). */
const sessionsWithCurrent = computed(() => {
    const currentId = sessionStore.sessionId?.value ?? sessionStore.sessionId ?? null
    const list = Array.isArray(sessions.value) ? sessions.value : []
    return list.map((s) => ({ ...s, current: !!currentId && s.id === currentId }))
})

const columns = [
    { title: 'Устройство / информация', dataIndex: 'userAgent', key: 'userAgent' },
    { title: 'Дата входа', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
    { title: '', key: 'action', width: 120, align: 'right' as const }
]

function formatDate(iso: string) {
    return new Date(iso).toLocaleString('ru-RU')
}

async function load() {
    loading.value = true
    try {
        const data = await getSessions()
        sessions.value = Array.isArray(data) ? data : []
    } catch {
        sessions.value = []
    } finally {
        loading.value = false
    }
}

type SessionRow = SessionInfo & { current?: boolean }

async function handleRevoke(record: SessionRow): Promise<void> {
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
        <ThePageHeader title="Сессии">
            <template #extra>
                <TheButton
                    type="primary"
                    danger
                    :disabled="sessions.length <= 1"
                    @click="handleRevokeAll"
                >
                    Завершить все кроме текущей
                </TheButton>
            </template>
        </ThePageHeader>

        <TheSpin :spinning="loading">
            <TheTable
                :columns="columns"
                :data-source="sessionsWithCurrent"
                :loading="loading"
                row-key="id"
            >
                <template #bodyCell="{ column, record }">
                    <template v-if="column?.key === 'userAgent'">
                        <span>
                            {{ record.userAgent ?? 'Не указано' }}
                            <TheTag
                                v-if="record.current"
                                color="blue"
                                class="sessions-page__current-tag"
                            >
                                Текущая
                            </TheTag>
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
                            @click="handleRevoke(record as SessionRow)"
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

.sessions-page__current-tag {
    margin-left: 8px;
}

.sessions-page__current {
    color: var(--color-text-secondary, #999);
}
</style>
