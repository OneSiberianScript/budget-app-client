# Темы (useTheme, getThemeOverrides)

Поддержка светлой, тёмной и монохромной темы. Состояние хранится в `data-theme` на `<html>` и в localStorage.

## useTheme()

Composable: реактивные `themeId` и `setThemeId(id)`. При смене темы обновляются атрибут и localStorage. Передавайте `getThemeOverrides(themeId)` в ConfigProvider (Ant Design Vue) для токенов и компонентов.

```ts
import { useTheme } from '@/shared/config/theme/useTheme'
import { getThemeOverrides } from '@/shared/config/theme/getThemeOverrides'

const { themeId, setThemeId } = useTheme()
const themeOverrides = computed(() => getThemeOverrides(themeId.value))
```

## getThemeOverrides(themeId)

Возвращает объект переопределений темы для Ant Design Vue ConfigProvider (`ThemeConfig`). Идентификаторы: `'light' | 'dark' | 'monochrome'`.

## Токены и CSS

Переменные для `data-theme` задаются в `src/app/styles/tokens.css`. Компоненты и глобальные стили используют эти переменные для цветов и отступов.
