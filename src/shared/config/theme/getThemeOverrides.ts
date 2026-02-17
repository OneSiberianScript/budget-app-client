import { darkThemeOverrides } from './dark'
import { lightThemeOverrides } from './light'
import { monochromeThemeOverrides } from './monochrome'

import type { ThemeId } from './types'
import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context'

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
