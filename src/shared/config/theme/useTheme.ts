import { ref, watch } from 'vue'

import { DEFAULT_THEME } from './constants'
import { getThemeOverrides } from './getThemeOverrides'

import type { ThemeId } from './types'
import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context'

const STORAGE_KEY = 'app_theme'

const VALID_THEMES: ThemeId[] = ['light', 'dark']

function getSystemTheme(): ThemeId {
    if (typeof window === 'undefined') return DEFAULT_THEME
    try {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
    } catch {
        // ignore
    }
    return 'light'
}

function readStored(): ThemeId {
    if (typeof document === 'undefined') return DEFAULT_THEME
    try {
        const s = localStorage.getItem(STORAGE_KEY) as ThemeId | null
        if (s && VALID_THEMES.includes(s)) return s
        if (typeof window !== 'undefined') return getSystemTheme()
        const v = document.documentElement.getAttribute('data-theme') as ThemeId | null
        if (v && VALID_THEMES.includes(v)) return v
    } catch {
        // ignore
    }
    return DEFAULT_THEME
}

function applyTheme(id: ThemeId) {
    if (typeof document === 'undefined') return
    document.documentElement.setAttribute('data-theme', id)
}

const current = ref<ThemeId>(readStored())

let systemPreferenceListenerAdded = false

function addSystemPreferenceListener() {
    if (systemPreferenceListenerAdded || typeof window === 'undefined') return
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored !== null) return
        systemPreferenceListenerAdded = true
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (localStorage.getItem(STORAGE_KEY) !== null) return
            current.value = getSystemTheme()
        })
    } catch {
        // ignore
    }
}

/**
 * Реактивный id темы и setter. По умолчанию тема берётся из настроек ОС/браузера (prefers-color-scheme).
 * Явный выбор пользователя сохраняется в localStorage и имеет приоритет.
 * Overrides для ConfigProvider: передавать themeOverrides.
 */
export function useTheme() {
    addSystemPreferenceListener()

    watch(current, (id) => applyTheme(id), { immediate: true })

    function setTheme(id: ThemeId) {
        current.value = id
        try {
            localStorage.setItem(STORAGE_KEY, id)
        } catch {
            // ignore
        }
    }

    const themeOverrides = ref<ThemeConfig>(getThemeOverrides(current.value))
    watch(
        current,
        (id) => {
            themeOverrides.value = getThemeOverrides(id)
        },
        { immediate: true }
    )

    return {
        currentTheme: current,
        setTheme,
        themeOverrides
    }
}
