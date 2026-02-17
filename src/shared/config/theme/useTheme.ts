import { ref, watch } from 'vue'
import type { ThemeId } from './types'
import { DEFAULT_THEME } from './constants'
import { getThemeOverrides } from './getThemeOverrides'
import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context'

const STORAGE_KEY = 'app_theme'

function readStored(): ThemeId {
    if (typeof document === 'undefined') return DEFAULT_THEME
    try {
        const v = document.documentElement.getAttribute('data-theme') as ThemeId | null
        if (v && (v === 'light' || v === 'dark' || v === 'monochrome')) return v
        const s = localStorage.getItem(STORAGE_KEY) as ThemeId | null
        if (s && (s === 'light' || s === 'dark' || s === 'monochrome')) return s
    } catch {
        // ignore
    }
    return DEFAULT_THEME
}

function applyTheme(id: ThemeId) {
    if (typeof document === 'undefined') return
    document.documentElement.setAttribute('data-theme', id)
    try {
        localStorage.setItem(STORAGE_KEY, id)
    } catch {
        // ignore
    }
}

const current = ref<ThemeId>(readStored())

/**
 * Reactive theme id and setter. Persists to localStorage and data-theme on html.
 * Overrides for ConfigProvider: use getThemeOverrides(currentTheme).
 */
export function useTheme() {
    watch(
        current,
        (id) => applyTheme(id),
        { immediate: true }
    )

    function setTheme(id: ThemeId) {
        current.value = id
    }

    const themeOverrides = ref<ThemeConfig>(getThemeOverrides(current.value))
    watch(current, (id) => {
        themeOverrides.value = getThemeOverrides(id)
    }, { immediate: true })

    return {
        currentTheme: current,
        setTheme,
        themeOverrides
    }
}
