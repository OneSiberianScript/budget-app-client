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
| `VITE_API_TIMEOUT_MS` | Таймаут запросов в мс (по умолчанию 5000)                     |

В разработке бэкенд должен разрешать CORS для origin фронта (например http://localhost:5173) и отправлять cookies (`CORS_CREDENTIALS=true`). Либо задайте `VITE_API_BASE_URL=/api` — запросы пойдут на same-origin и будут проксироваться на бэкенд (см. `vite.config.ts`), без CORS и с корректной отправкой cookies.

## Запуск в Docker

Сборка выполняется через multi-stage Dockerfile (Node — сборка, nginx — раздача статики). Для ускорения повторных сборок используется BuildKit (кэш npm), `npm ci` и `.dockerignore`; в nginx включены gzip и кэширование статики (JS/CSS/шрифты/картинки). Конфиг nginx (`budget-app-front.conf`) настроен с fallback на `index.html` для клиентских маршрутов (прямые переходы по ссылкам вроде `/auth/login` отдают 200 и SPA). Переменные `VITE_*` подставляются **на этапе сборки**: передавайте их как build-аргументы.

При запуске через docker-compose из родительского репозитория задайте в `.env` рядом с `docker-compose.yml` переменные `VITE_API_BASE_URL` и `VITE_API_TIMEOUT_MS`; в compose у сервиса frontend должны быть указаны `build.args` с этими переменными. Файл `.env` в корне этого репозитория не коммитится (см. `.gitignore`).

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
| `npm run test:run`      | Запуск тестов (Vitest)              |
| `npm run test:coverage` | Запуск тестов с отчётом покрытия    |
| `npm run test:e2e`      | E2E-тесты (Playwright)              |

## Структура репозитория

- `src/app` — инициализация приложения, провайдеры, роутер
- `src/pages` — страницы (роуты)
- `src/widgets` — композиции блоков (layout, budget-switcher)
- `src/features` — сценарии (auth: login, register, confirm-email по ссылке из письма, confirm-email-required при неподтверждённом email)
- `src/entities` — сущности (session, account, budget, category, transaction и др.)
- `src/shared` — API (httpClient, useApi, request), UI (The\*), lib (validation, confirm, message), config

Импорты только вниз по слоям. Публичный API слоя — через `index.ts`. Подробнее: `.cursor/rules/architecture.mdc`, `docs/`.
