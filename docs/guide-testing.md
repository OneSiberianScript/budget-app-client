# Руководство по тестированию

Исчерпывающее руководство по тестированию в проекте budget-app-client.

## 1. Принципы и пирамида тестов

- **Unit** (много) → **Component** (меньше) → **E2E** (мало)
- Пирамида: быстрые unit, средние component, медленные E2E
- Unit-тесты проверяют изолированную логику (схемы, функции, composables)
- Component-тесты проверяют UI-компоненты и формы
- E2E-тесты проверяют критичные пользовательские сценарии
- **При создании** shared UI, схем форм, composables, store/API — сразу писать colocated-тесты (unit/component). Для новых критичных сценариев — E2E при необходимости.

## 2. Структура и размещение

### test/ — инфраструктура и E2E

```
test/
├── e2e/                    # E2E-тесты (Playwright)
│   └── auth.spec.ts
├── setup.ts                # Глобальный setup Vitest
├── utils.ts                # mountWithProviders и хелперы
├── mocks/
│   └── api.ts
├── coverage/               # Артефакты Vitest (gitignore)
├── playwright-report/     # Артефакты Playwright (gitignore)
└── test-results/          # Traces, screenshots (gitignore)
```

### src/**/*.spec.ts — colocated unit/component

Unit- и component-спеки размещаются рядом с исходником (FSD):

| Слой | Пример | Что тестировать |
|------|--------|-----------------|
| shared | `shared/lib/validation/primitives.spec.ts` | Zod-примитивы, утилиты |
| shared | `shared/ui/TheInput.spec.ts` | UI-компоненты |
| entities | — | Store, API (при необходимости) |
| features | `features/auth/login/model/LoginForm.schema.spec.ts` | Zod-схемы форм |
| features | `features/auth/login/ui/LoginForm.spec.ts` | Формы, виджеты |
| pages | — | Редко (через E2E) |
| e2e | `test/e2e/*.spec.ts` | Критичные флоу |

## 3. Виды тестов

### Unit

- **Zod-схемы** — валидация полей, граничные значения
- **Чистые функции** — без side effects
- **Composables** — изолированно с моками

### Component

- **Shared UI** (The*) — рендер, props, события
- **Формы** — submit, валидация, интеграция с VeeValidate
- **Виджеты** — композиция, взаимодействие

### E2E

- **Критичные сценарии** — auth, основные флоу
- **Реальный браузер** — Playwright, page.route() для мока API

## 4. Инструменты

| Инструмент | Назначение |
|------------|------------|
| **Vitest** | Unit и component тесты |
| **@vue/test-utils** | mount, flushPromises |
| **jsdom** | DOM-окружение для Vitest |
| **@pinia/testing** | createTestingPinia |
| **Playwright** | E2E тесты |
| **@vitest/coverage-v8** | Покрытие кода |

## 5. Практические рекомендации

### mountWithProviders

Используйте хелпер из `@test/utils`:

```ts
import { mountWithProviders } from '@test/utils'

const wrapper = await mountWithProviders(LoginForm, { route: '/auth' })
```

Опции: `route`, `stubActions` (по умолчанию `true`).

### Моки

- **toast, ResizeObserver, IntersectionObserver** — в `test/setup.ts` (глобально)
- **API** — через `vi.mock` в тесте или `test/mocks/api.ts`
- **Pinia** — `createTestingPinia` внутри `mountWithProviders`

### TheInput и формы с VeeValidate

Формы требуют обёртку `Form` (Ant Design Vue) + `useForm`. `mountWithProviders` подключает router и Pinia; для форм с VeeValidate убедитесь, что схема и поля корректно связаны.

### E2E: селекторы

Используйте `getByLabel()` и `getByRole()` — они устойчивы к изменениям разметки и соответствуют доступности:

```ts
await page.getByLabel('Email').fill('user@example.com')
await page.getByRole('button', { name: 'Войти' }).click()
```

TheInput, TheSelect, TheCheckbox передают `label` так, чтобы селекторы по доступности работали; при использовании с Ant Design Vue Form.Item связь label–input обеспечивается через переданный `label`. TheDatePicker: используйте `getByPlaceholder()` или `data-testid`.

### E2E: валидация форм

Если кнопка отправки отключена при невалидных данных (`canSubmit = meta.valid`), валидация срабатывает на blur. Не кликайте по disabled-кнопке — используйте focus на соседнее поле:

```ts
await page.getByLabel('Email').fill('invalid')
await page.getByLabel('Пароль').focus() // blur email → triggers validation
await expect(page.getByText('Некорректный email')).toBeVisible()
```

### E2E: мок API

```ts
await page.route('**/api/auth/login', async (route) => {
    await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ accessToken: 'test-token' })
    })
})
```

## 6. Консолидация артефактов

Все артефакты тестов в `test/`:

- `test/coverage` — отчёт Vitest
- `test/playwright-report` — HTML-отчёт Playwright
- `test/test-results` — traces, screenshots

Одна точка входа для тестовой инфраструктуры.

## 7. Ссылки

- [ref-npm-scripts.md](./ref-npm-scripts.md) — команды `test`, `test:run`, `test:coverage`, `test:e2e`
- [.cursor/rules/tests.mdc](../.cursor/rules/tests.mdc) — правила для AI при написании тестов
