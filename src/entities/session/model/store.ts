import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import * as sessionApi from '../api'

import type { SessionUser } from './types'

export const useSessionStore = defineStore('session', () => {
    const accessToken = ref<string | null>(null)
    const user = ref<SessionUser | null>(null)

    const isAuthenticated = computed(() => !!accessToken.value)

    function setSession(token: string, userData: SessionUser) {
        accessToken.value = token
        user.value = userData
        try {
            sessionStorage.setItem('session_accessToken', token)
            sessionStorage.setItem('session_user', JSON.stringify(userData))
        } catch {
            // ignore
        }
    }

    function setAccessToken(token: string) {
        accessToken.value = token
        try {
            sessionStorage.setItem('session_accessToken', token)
        } catch {
            // ignore
        }
    }

    function clearSession() {
        accessToken.value = null
        user.value = null
        try {
            sessionStorage.removeItem('session_accessToken')
            sessionStorage.removeItem('session_user')
        } catch {
            // ignore
        }
    }

    function hydrateFromStorage() {
        try {
            const token = sessionStorage.getItem('session_accessToken')
            const userJson = sessionStorage.getItem('session_user')
            if (token && userJson) {
                accessToken.value = token
                user.value = JSON.parse(userJson) as SessionUser
            }
        } catch {
            clearSession()
        }
    }

    async function refreshSession(): Promise<boolean> {
        try {
            const res = await sessionApi.refresh()
            setSession(res.accessToken, res.user)
            return true
        } catch {
            clearSession()
            return false
        }
    }

    return {
        accessToken,
        user,
        isAuthenticated,
        setSession,
        setAccessToken,
        clearSession,
        hydrateFromStorage,
        refreshSession
    }
})
