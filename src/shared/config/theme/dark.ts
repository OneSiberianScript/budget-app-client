import { theme } from 'ant-design-vue'

import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context'

/** Design tokens: design-tokens.tokens.json */
export const darkThemeOverrides: ThemeConfig = {
    token: {
        colorPrimary: '#f5b72b',
        colorBgContainer: '#3a3734',
        colorBorder: '#4e4a47',
        colorText: '#fafafa',
        colorTextSecondary: '#d6d3cf',
        borderRadius: 6
    },
    algorithm: theme.darkAlgorithm
}
