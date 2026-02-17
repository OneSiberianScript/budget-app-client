# Руководство по документированию кода

Что и как документировать в budget-app-client. Архитектура: [architecture.mdc](../.cursor/rules/architecture.mdc).

## Что документировать

Только **публичный API** — экспорты из `index.ts` слоя и то, что импортируют из других слоёв. Компоненты (The*), composables и экспортируемые функции считаются публичным API; **при создании нового такого кода JSDoc обязателен.**

| Слой           | Что документировать                                 |
| -------------- | --------------------------------------------------- |
| **shared/api** | useApi, request, httpClient, toApiError             |
| **shared/lib** | confirm, toast, toFieldErrors, примитивы validation |
| **shared/ui**  | Props, slots, emits компонентов The\*               |
| **entities**   | API-функции, типы, store actions                    |
| **features**   | Composables (useDeleteAccount и т.п.)               |

Внутренние хелперы — когда логика неочевидна.

## Формат JSDoc

**Язык:** весь JSDoc (описания, @param, @returns, @typedef и т.д.) пишется **на русском**.

### Функции и composables

```ts
/**
 * Загружает данные через переданную async-функцию. При ошибке записывает её в error.
 * @param fn - Функция, возвращающая Promise (например, вызов httpClient.get)
 * @param options.immediate - Запустить fn сразу при монтировании
 * @returns { data, error, isLoading, execute }
 */
export function useApi<T>(fn: ApiFn<T>, options?: { immediate?: boolean }) { ... }
```

- Краткое описание в первой строке
- `@param` для каждого аргумента
- `@returns` для возвращаемого значения (если не очевидно из типа)

### Vue-компоненты (props)

JSDoc над каждым свойством в типе `Props` — **Volar показывает в hover** при наведении на prop в шаблоне. Пример: `src/shared/ui/TheInput.vue`.

```ts
type Props = {
    /** Имя поля для VeeValidate (должно совпадать с ключом в схеме формы) */
    name: string
    /** Подпись над полем */
    label?: string
    /** Placeholder в пустом поле */
    placeholder?: string
}
```

Компонентный блок `/** ... @component */` в hover не отображается (Volar не использует), но полезен для docgen и чтения кода.

### Типы

`@typedef` для сложных структур, если не очевидно из TypeScript:

```ts
/**
 * @typedef {Object} ApiError
 * @property {string} code - Код ошибки (UNAUTHORIZED, NETWORK_ERROR и т.д.)
 * @property {string} message - Человекочитаемое сообщение
 */
```

## Где размещать docs.md

В сложных модулях, где нужен отдельный гайд:

- `shared/lib/validation/docs.md` — примитивы, toFieldErrors, как импортировать
- `shared/api/docs.md` — useApi, request, httpClient, toApiError
- `shared/config/theme/docs.md` — useTheme, getThemeOverrides, темы

Формат: Markdown с примерами кода, таблицами опций, ссылками на исходники.

## Стиль документации

Документация должна выглядеть так, будто её писал человек, а не ИИ:

- **Без эмодзи** в заголовках
- **Коротко** — меньше подзаголовков, по делу
- **Личный тон** — «обычно», «лучше», «не стоит», «проверено»
- **Избегать шаблонов**: «Пошаговая инструкция», «Важно отметить», «Данный документ описывает», «См. также»
- **Не дублировать** — если сказано в одном месте, не повторять в другом
- **Без заглушек** — не оставлять `[Указать лицензию]` и подобное

## Ссылки

- [create-entity.md](./create-entity.md) — создание сущности
- [create-form.md](./create-form.md) — создание формы
- [create-route.md](./create-route.md) — добавление маршрута
- [use-modal.md](./use-modal.md) — TheModal и confirm
- [guide-ui-and-responsive.md](./guide-ui-and-responsive.md) — UI, responsive, mobile-first и скролл
