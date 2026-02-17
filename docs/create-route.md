# Создание нового маршрута

Как добавить маршрут и страницу в проект.

## 1. Константы маршрута

`src/shared/config/router.ts` — добавьте в `ROUTE_NAMES` и `ROUTE_PATHS`:

```typescript
export const ROUTE_NAMES = {
    // ...
    NEW_PAGE: 'new-page'
} as const

export const ROUTE_PATHS = {
    // ...
    NEW_PAGE: '/new-page'
} as const
```

Имя — `UPPER_SNAKE_CASE`, значение — `kebab-case`. Путь с `/`. Для параметров: `'/users/:id'`.

## 2. Типизация

`src/shared/config/router.types.ts` — запись в `RouteNamedMap`:

```typescript
export interface RouteNamedMap {
    // ...
    'new-page': RouteRecordInfo<'new-page', '/new-page', Record<never, never>, Record<never, never>, never>
}
```

С параметрами (например `/users/:id`):

```typescript
'user-detail': RouteRecordInfo<
  'user-detail',
  '/users/:id',
  { id: string | number },
  { id: string },
  never
>
```

## 3. Маршрут в конфигурации

`src/app/providers/router/routes.ts`:

```typescript
{
    path: ROUTE_PATHS.NEW_PAGE,
    name: ROUTE_NAMES.NEW_PAGE,
    component: () => import('@/pages/new-page/ui/NewPagePage.vue'),
    meta: {
        requiresAuth: true,
        layout: 'main',
        title: 'Новая страница',
    },
},
```

404 (`path: '/:pathMatch(.*)*'`) — последним. Lazy import для всех страниц.

## 4. Страница

Директория `src/pages/new-page/` (kebab-case). Компонент `NewPagePage.vue` с классом `new-page-page`:

```vue
<script setup lang="ts"></script>

<template>
    <div class="new-page-page">
        <h1>Новая страница</h1>
    </div>
</template>

<style scoped>
.new-page-page {
    padding: 24px;
}
</style>
```

`index.ts`:

```typescript
export { default as NewPagePage } from './ui/NewPagePage.vue'
```

## Маршрут с параметрами — полный пример

Константы, типизация, routes — как выше. В компоненте:

```vue
<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const userId = route.params.id as string
</script>
```

## Чеклист

- Константы в `ROUTE_NAMES` и `ROUTE_PATHS` в одном порядке
- Типизация совпадает с константами (имя, путь)
- 404 — последний в `routes`
- TypeScript без ошибок, маршрут открывается, автодополнение `router.push({ name: ROUTE_NAMES.NEW_PAGE })` работает
- Вёрстка страницы сделана mobile-first; отображение проверено на узком viewport
- Страница помещается в viewport по высоте; при необходимости скролла — только у основной контентной области, не у всей страницы
