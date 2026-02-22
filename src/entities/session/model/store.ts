import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import * as sessionApi from '../api'

import type { AuthUser } from './types'

/** Ответ refresh (accessToken, sessionId, опционально user) */
type RefreshResponse = { accessToken: string; sessionId: string; user?: AuthUser }

export const useSessionStore = defineStore('session', () => {
    const accessToken = ref<string | null>(null)
    const sessionId = ref<string | null>(null)
    const user = ref<AuthUser | null>(null)

    /** Промис текущего restoreSession() — гард ждёт его перед редиректом на логин (устраняет гонку при первой навигации). */
    const restorePromise = ref<Promise<boolean> | null>(null)

    const isAuthenticated = computed(() => !!accessToken.value)

    function setSession(token: string, userData: AuthUser, currentSessionId?: string) {
        accessToken.value = token
        user.value = userData
        if (currentSessionId !== undefined) sessionId.value = currentSessionId
    }

    function setAccessToken(token: string, currentSessionId?: string) {
        accessToken.value = token
        if (currentSessionId !== undefined) sessionId.value = currentSessionId
    }

    function clearSession() {
        accessToken.value = null
        sessionId.value = null
        user.value = null
    }

    /**
     * Восстанавливает сессию при старте приложения (вызов refresh по cookie).
     * Не вызывает clearSession и редирект при ошибке — только возвращает false.
     * Промис сохраняется в restorePromise, чтобы гард мог дождаться завершения до редиректа на логин.
     */
    async function restoreSession(): Promise<boolean> {
        const promise = (async (): Promise<boolean> => {
            try {
                const res: RefreshResponse = await sessionApi.refresh()
                if (res.user) {
                    setSession(res.accessToken, res.user, res.sessionId)
                } else {
                    setAccessToken(res.accessToken, res.sessionId)
                }
                return true
            } catch {
                return false
            } finally {
                restorePromise.value = null
            }
        })()
        restorePromise.value = promise
        return promise
    }

    async function refreshSession(): Promise<boolean> {
        try {
            const res: RefreshResponse = await sessionApi.refresh()
            if (res.user) {
                setSession(res.accessToken, res.user, res.sessionId)
            } else {
                setAccessToken(res.accessToken, res.sessionId)
            }
            return true
        } catch {
            clearSession()
            return false
        }
    }

    return {
        accessToken,
        sessionId,
        user,
        isAuthenticated,
        restorePromise,
        setSession,
        setAccessToken,
        clearSession,
        restoreSession,
        refreshSession
    }
})
