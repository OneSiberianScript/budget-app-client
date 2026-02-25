# Темы (useTheme, getThemeOverrides)

Поддержка светлой и тёмной темы. Палитра — из `design-tokens.tokens.json`.

**Поведение:** по умолчанию тема берётся из настроек ОС/браузера (`prefers-color-scheme`). Явный выбор пользователя сохраняется в localStorage (ключ `app_theme`) и имеет приоритет. При смене системной темы приложение следует ей, если пользователь ещё не выбирал тему вручную. Атрибут `data-theme` на `<html>` обновляется при смене темы.

## useTheme()

Composable: реактивные `currentTheme`, `setTheme(id)` и `themeOverrides`. Вызов `setTheme(id)` сохраняет выбор в localStorage; без сохранённого выбора используется системная тема. Передавайте `themeOverrides` в ConfigProvider (Ant Design Vue).

```ts
import { useTheme } from '@/shared/config/theme/useTheme'

const { currentTheme, setTheme, themeOverrides } = useTheme()
// В App.vue: <ConfigProvider :theme="themeOverrides">
```

## getThemeOverrides(themeId)

Возвращает объект переопределений темы для Ant Design Vue ConfigProvider (`ThemeConfig`). Идентификаторы: `'light' | 'dark'`.

## Токены и CSS

Переменные для `[data-theme='light']` и `[data-theme='dark']` задаются в `src/app/styles/tokens.css`; значения соответствуют `design-tokens.tokens.json`. Компоненты используют эти переменные для цветов (в т.ч. алиасы обратной совместимости: `--color-bg`, `--color-text`, `--color-border`, `--color-primary`, `--color-error`, `--color-warning`, `--color-bg-container`).
