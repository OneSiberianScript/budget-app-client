# budget-app-client

Клиентское приложение для учёта бюджета: Vue 3, TypeScript, Vite. Архитектура — FSD (Feature-Sliced Design).

## Запуск

```bash
npm install
npm run dev
```

Приложение откроется по адресу из вывода Vite (обычно http://localhost:5173).

## Переменные окружения

Скопируйте `.env.example` в `.env` и при необходимости измените значения:

| Переменная            | Описание                                                      |
| --------------------- | ------------------------------------------------------------- |
| `VITE_API_BASE_URL`   | Базовый URL API (бэкенд). Пример: `http://localhost:3000/api` |
| `VITE_API_TIMEOUT_MS` | Таймаут запросов в мс (по умолчанию 15000)                    |

В разработке бэкенд должен разрешать CORS для origin фронта (например http://localhost:5173) и отправлять cookies (`CORS_CREDENTIALS=true`).

## Скрипты

| Команда                 | Описание                            |
| ----------------------- | ----------------------------------- |
| `npm run dev`           | Запуск dev-сервера                  |
| `npm run build`         | Сборка для production               |
| `npm run preview`       | Просмотр production-сборки локально |
| `npm run lint`          | Проверка ESLint                     |
| `npm run lint:fix`      | Автоисправление ESLint              |
| `npm run format`        | Форматирование Prettier             |
| `npm run format:check`  | Проверка формата без записи         |
| `npm run build:analyze` | Сборка с отчётом по размеру бандла  |
| `npm run test:run`      | Запуск тестов                       |

## Структура репозитория

- `src/app` — инициализация приложения, провайдеры, роутер
- `src/pages` — страницы (роуты)
- `src/widgets` — композиции блоков (layout, budget-switcher)
- `src/features` — сценарии (auth: login, register)
- `src/entities` — сущности (session, account, budget, category, transaction и др.)
- `src/shared` — API (httpClient, useApi, request), UI (The\*), lib (validation, confirm, message), config

Импорты только вниз по слоям. Публичный API слоя — через `index.ts`. Подробнее: `.cursor/rules/architecture.mdc`, `docs/`.
