import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context'
import type { ThemeId } from './types'
import { lightThemeOverrides } from './light'
import { darkThemeOverrides } from './dark'
import { monochromeThemeOverrides } from './monochrome'

const overrides: Record<ThemeId, ThemeConfig> = {
    light: lightThemeOverrides,
    dark: darkThemeOverrides,
    monochrome: monochromeThemeOverrides
}

/**
 * Returns Ant Design Vue theme/token overrides for the given theme id.
 */
export function getThemeOverrides(themeId: ThemeId): ThemeConfig {
    return overrides[themeId] ?? lightThemeOverrides
}
