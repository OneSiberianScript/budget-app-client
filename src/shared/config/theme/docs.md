# Theme

`useTheme()` — текущая тема (currentTheme), setTheme(id), themeOverrides для ConfigProvider. Темы: light, dark, monochrome. Значение пишется в data-theme на `<html>` и в localStorage (app_theme).

`getThemeOverrides(themeId)` — токены/алгоритм Ant Design Vue для заданной темы. В App.vue оборачиваем приложение в ConfigProvider с :theme="themeOverrides".

CSS-переменные по data-theme задаются в `src/app/styles/tokens.css`.
