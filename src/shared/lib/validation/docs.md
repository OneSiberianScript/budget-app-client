# Validation (Zod + VeeValidate)

Примитивы в `primitives.ts`: используй их в схемах форм вместо дублирования. Импорт: `@/shared/lib/validation` или из `primitives`/`errors` напрямую.

`toFieldErrors(ZodError)` — маппинг ошибок Zod в объект «имя поля → сообщение» для VeeValidate (setFieldError или отображение под полями).

Формы: схема в `model/FormName.schema.ts`, `z.object({ ... })`, примитивы из этого модуля. В компоненте — `useForm` + `toTypedSchema(schema)` из `@vee-validate/zod`.
