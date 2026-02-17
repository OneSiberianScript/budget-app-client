# API (axios, request, перехватчики)

Единая точка запросов к бэкенду: `request()`, перехватчики для Bearer, 401/refresh и toast при ошибках.

## Конфигурация

`config.ts`: `apiConfig.baseURL` (из `VITE_API_BASE_URL`), `apiConfig.timeout`. Base URL должен включать префикс `/api`.

Все запросы идут с `withCredentials: true` (cookies для refresh).

## request()

Типизированная обёртка над `httpClient`. Используется в entities и features.

```ts
import { request } from '@/shared/api/request'

const data = await request<MyType>({ method: 'GET', url: '/budgets' })
```

Опция `_suppressErrorNotification: true` — не показывать toast при ошибке (refresh, logout).

## httpClient

Прямое использование редко нужно. Перехватчики: подстановка Bearer из Pinia, при 401 — один вызов refresh, повтор запроса; при ошибке — toast (если не `_suppressErrorNotification`).

## toApiError

Преобразует исключение axios в `{ code, message }`. Учитывает формат бэкенда `{ error: { code, message } }`. Используется в формах и обработчиках.

## useApi

Composable для загрузки с состоянием `{ data, error, isLoading, execute }`. Удобен для страниц с одной асинхронной загрузкой.

## Ошибки

Формат ответа ошибки с бэкенда: `{ error: { code: string, message: string } }`. В формах логина/регистрации можно обрабатывать коды (например 409) для осмысленных сообщений.
