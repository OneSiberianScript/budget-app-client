import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import * as sessionApi from '../api'

import type { AuthUser } from './types'

export const useSessionStore = defineStore('session', () => {
    const accessToken = ref<string | null>(null)
    const sessionId = ref<string | null>(null)
    const user = ref<AuthUser | null>(null)

    const isAuthenticated = computed(() => !!accessToken.value)

    function setSession(token: string, userData: AuthUser, currentSessionId?: string) {
        accessToken.value = token
        user.value = userData
        if (currentSessionId !== undefined) sessionId.value = currentSessionId
        try {
            sessionStorage.setItem('session_accessToken', token)
            sessionStorage.setItem('session_user', JSON.stringify(userData))
            if (currentSessionId) sessionStorage.setItem('session_sessionId', currentSessionId)
        } catch {
            // ignore
        }
    }

    function setAccessToken(token: string, currentSessionId?: string) {
        accessToken.value = token
        if (currentSessionId !== undefined) sessionId.value = currentSessionId
        try {
            sessionStorage.setItem('session_accessToken', token)
            if (currentSessionId) sessionStorage.setItem('session_sessionId', currentSessionId)
        } catch {
            // ignore
        }
    }

    function clearSession() {
        accessToken.value = null
        sessionId.value = null
        user.value = null
        try {
            sessionStorage.removeItem('session_accessToken')
            sessionStorage.removeItem('session_sessionId')
            sessionStorage.removeItem('session_user')
        } catch {
            // ignore
        }
    }

    function hydrateFromStorage() {
        try {
            const token = sessionStorage.getItem('session_accessToken')
            const userJson = sessionStorage.getItem('session_user')
            const sid = sessionStorage.getItem('session_sessionId')
            if (token && userJson) {
                accessToken.value = token
                user.value = JSON.parse(userJson) as AuthUser
                if (sid) sessionId.value = sid
            }
        } catch {
            clearSession()
        }
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
        setSession,
        setAccessToken,
        clearSession,
        hydrateFromStorage,
        refreshSession
    }
})
