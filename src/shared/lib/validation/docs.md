# Валидация (Zod + примитивы)

Используется в формах вместе с VeeValidate (`toTypedSchema`). Схемы собираются из примитивов и локальных расширений.

## Импорт

```ts
import { email, password, nonEmptyString, nameField } from '@/shared/lib/validation/primitives'
import { toFieldErrors } from '@/shared/lib/validation/errors'
```

## Примитивы (`primitives.ts`)

| Примитив                | Назначение                                     |
| ----------------------- | ---------------------------------------------- |
| `nonEmptyString`        | Строка без пробелов по краям, минимум 1 символ |
| `email`                 | Обязательный email, валидный формат            |
| `password`              | Минимум 8 символов                             |
| `uuid`                  | UUID v4                                        |
| `phoneE164`             | Телефон E.164 или пустая строка                |
| `optionalTrimmedString` | Опциональная строка с trim                     |
| `nullableTrimmedString` | Строка с trim; пустая → null                   |
| `positiveInt`           | Положительное целое (coerce)                   |
| `nameField`             | 2–50 символов                                  |

Локальные расширения — через `.min()`, `.max()`, `.refine()`, `.transform()`.

## Ошибки (`errors.ts`)

`toFieldErrors(zodError)` — превращает `ZodError` в `Record<string, string>` для отображения ошибок по полям (например в формах).

## Связь с формами

В фичах формы: схема в `model/{FormName}.schema.ts`, типы `z.infer<typeof schema>` в `model/{FormName}.types.ts`. Компонент подключает схему через `useForm` + `toTypedSchema`. Подробнее: [create-form.md](../../../docs/create-form.md).
