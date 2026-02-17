# Создание формы в проекте

Подход к формам: **Zod** для валидации, **vee-validate** для интеграции с Vue.

## Структура

```
src/features/{feature-name}/{form-name}/
├── model/
│   ├── {FormName}.schema.ts   # Zod-схема
│   ├── {FormName}.types.ts    # z.infer + начальные значения
│   └── {FormName}.errors.ts   # опционально
└── ui/
    └── {FormName}.vue
```

## 1. Схема (`{FormName}.schema.ts`)

Примитивы из `@/shared/lib/validation`: `email`, `nonEmptyString`, `phoneE164`, `password`, `uuid`, `positiveInt`, `optionalTrimmedString`, `nullableTrimmedString`.

Локальные расширения для ограничений:

```typescript
const name = nonEmptyString.min(2, 'Минимум 2 символа').max(50, 'Максимум 50 символов')
```

Трансформации для нормализации:

```typescript
const telegram = z
    .string()
    .transform((v) => v.trim())
    .refine((v) => v === '' || /^@?[a-zA-Z0-9_]{5,32}$/.test(v), 'Telegram: @username (5–32 символа)')
    .transform((v) => (v === '' ? '' : v.startsWith('@') ? v : `@${v}`))
```

Сборка схемы:

```typescript
export const registerFormSchema = z.object({
    email,
    firstName: name,
    lastName: name,
    phone: phoneE164,
    telegram,
    password
})
```

Поля схемы = поля в компоненте. `.transform()` для нормализации, `.refine()` для кастомных проверок.

## 2. Типы и начальные значения (`{FormName}.types.ts`)

```typescript
import type { z } from '@/shared/lib/validation'
import { registerFormSchema } from './RegisterForm.schema'

export type RegisterFormValues = z.infer<typeof registerFormSchema>

export const registerFormInitialValues: RegisterFormValues = {
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    telegram: '',
    password: ''
}
```

Не используйте `zod.default()` — проблемы с `toTypedSchema`. Начальные значения отдельно от схемы.

## 3. Компонент (`{FormName}.vue`)

```typescript
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { registerFormSchema } from '../model/RegisterForm.schema'
import { registerFormInitialValues } from '../model/RegisterForm.types'
import type { RegisterFormValues } from '../model/RegisterForm.types'

const { handleSubmit, meta, isSubmitting } = useForm<RegisterFormValues>({
    validationSchema: toTypedSchema(registerFormSchema),
    initialValues: registerFormInitialValues
})

const canSubmit = computed(() => meta.value.valid && !isSubmitting.value)

const onSubmit = handleSubmit(async (values) => {
    // values уже валидированы
})
```

UI: `<TheInput>`, `<TheSelect>`, `<TheCheckbox>` из `@/shared/ui`. Prop `name` в каждом поле = ключ в схеме.

```vue
<TheInput name="email" label="Email" type="email" autocomplete="email" />
<a-button type="primary" :loading="isSubmitting" :disabled="!canSubmit" @click="onSubmit">Отправить</a-button>
```

## Пример: LoginForm

```typescript
// LoginForm.schema.ts
export const loginFormSchema = z.object({ email, password })

// LoginForm.types.ts
export type LoginFormValues = z.infer<typeof loginFormSchema>
export const loginFormInitialValues: LoginFormValues = { email: '', password: '' }
```

Компонент — `useForm` + `toTypedSchema` + `TheInput` с `name="email"` и `name="password"`.

## Доступность для E2E

Компоненты TheInput, TheSelect, TheCheckbox передают `label` в нативный элемент так, чтобы Playwright `getByLabel('Email')` находил поля. У Ant Design Vue Form.Item при использовании с нашим TheInput/TheSelect связь label–input обеспечивается через переданный `label` и id/aria-*.

- Всегда передавайте `label` в TheInput/TheSelect/TheCheckbox — это нужно для `getByLabel()` в E2E
- TheDatePicker: при E2E с датами используйте `getByPlaceholder()` или `data-testid`

## Чеклист

- JSDoc для схемы (при необходимости), типов и Props компонента формы (см. [guide-documentation.md](./guide-documentation.md))
- Тесты: схема (примитивы, граничные значения), компонент формы (submit, валидация) — см. [guide-testing.md](./guide-testing.md)

## Рекомендации

- Переиспользуйте примитивы, не плодите валидаторы
- Типы из `z.infer`, не дублируйте
- Начальные значения отдельно — vee-validate так работает
- Сообщения об ошибках — понятные, на русском

## Troubleshooting

**Поле не валидируется** — `name` в компоненте должен совпадать с ключом в схеме.

**Ошибки типов** — `z.infer<typeof schema>`, начальные значения соответствуют типу.

**Трансформации** — применяются при валидации, не при вводе. `.transform()` перед `.refine()` если проверяешь после трансформации.
