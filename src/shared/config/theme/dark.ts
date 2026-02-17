import { theme } from 'ant-design-vue'

import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context'

export const darkThemeOverrides: ThemeConfig = {
    token: {
        colorPrimary: '#1677ff',
        borderRadius: 6
    },
    algorithm: theme.darkAlgorithm
}
