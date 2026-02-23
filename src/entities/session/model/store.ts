import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import type { User } from '@/shared/types'

import * as sessionApi from '../api'

import type { AuthUser } from './types'

export const useSessionStore = defineStore('session', () => {
    const accessToken = ref<string | null>(null)
    const sessionId = ref<string | null>(null)
    const user = ref<AuthUser | null>(null)

    /** Промис текущего restoreSession() — гард ждёт его перед редиректом на логин (устраняет гонку при первой навигации). */
    const restorePromise = ref<Promise<boolean> | null>(null)

    const isAuthenticated = computed(() => !!accessToken.value)

    const isEmailConfirmed = computed(() => user.value?.emailConfirmedAt != null)

    function setSession(token: string, userData: AuthUser, currentSessionId?: string) {
        accessToken.value = token
        user.value = userData
        if (currentSessionId !== undefined) sessionId.value = currentSessionId
    }

    function setAccessToken(token: string, currentSessionId?: string) {
        accessToken.value = token
        if (currentSessionId !== undefined) sessionId.value = currentSessionId
    }

    /** Сохраняет/обновляет текущего пользователя (без смены токена). */
    function setUser(userData: AuthUser | User | null) {
        user.value = userData
    }

    function clearSession() {
        accessToken.value = null
        sessionId.value = null
        user.value = null
    }

    /**
     * Восстанавливает сессию при старте приложения (refresh по cookie + GET /users/me).
     * Не вызывает clearSession и редирект при ошибке — только возвращает false.
     * Промис сохраняется в restorePromise, чтобы гард мог дождаться завершения до редиректа на логин.
     */
    async function restoreSession(): Promise<boolean> {
        const promise = (async (): Promise<boolean> => {
            try {
                const res = await sessionApi.refresh()
                setAccessToken(res.accessToken, res.sessionId)
                const me = await sessionApi.getCurrentUser()
                setUser(me)
                return true
            } catch {
                clearSession()
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
            const res = await sessionApi.refresh()
            setAccessToken(res.accessToken, res.sessionId)
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
        isEmailConfirmed,
        restorePromise,
        setSession,
        setAccessToken,
        setUser,
        clearSession,
        restoreSession,
        refreshSession
    }
})
