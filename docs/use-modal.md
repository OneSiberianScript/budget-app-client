# TheModal и confirm dialog

Как использовать компонент **TheModal** (`@/shared/ui/TheModal.vue`) и программный **confirm** из `@/shared/lib/confirm`.

## Когда что использовать

| Задача                                                                                | Решение                                              |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Диалог «Да/Нет» по клику (удалить?, выйти?)                                           | **confirm()** из `@/shared/lib/confirm`              |
| Модалка с произвольным контентом (форма, текст, таблица)                              | **TheModal** с `preset="dialog"` или `preset="card"` |
| Модалка-подтверждение в разметке (одна кнопка открывает, внутри «Подтвердить/Отмена») | **TheModal** с `preset="confirm"`                    |

## 1. Confirm dialog (программный вызов)

Для типовых подтверждений из кода используйте `confirm` из `@/shared/lib/confirm`. Окно создаётся через API Ant Design Vue (например Modal.confirm), не требует шаблона и возвращает `Promise<boolean>`.

### Базовый вызов

```ts
import { confirm } from '@/shared/lib/confirm'

const ok = await confirm({
    title: 'Удалить запись?',
    content: 'Действие нельзя отменить.',
    positiveText: 'Удалить',
    negativeText: 'Отмена'
})
if (ok) {
    // пользователь нажал «Удалить»
} else {
    // «Отмена», крестик, клик по маске или Esc
}
```

### Типы и шорткаты

- **type**: `'default' | 'info' | 'success' | 'warning' | 'error'` — иконка и акцент.
- Шорткаты задают `type` и позволяют не указывать его вручную:

```ts
confirm.warning({ title: 'Внимание', content: 'Вы уверены?' })
confirm.danger({ title: 'Удаление', content: 'Подтвердите удаление.' })
confirm.success({ title: 'Готово', content: 'Сохранить изменения?' })
confirm.info({ title: 'Информация', content: 'Продолжить?' })
```

### Опции ConfirmOptions

| Опция            | Тип           | По умолчанию    | Описание                                  |
| ---------------- | ------------- | --------------- | ----------------------------------------- |
| **title**        | `string`      | —               | Заголовок (обязательно).                  |
| **content**      | `string`      | —               | Текст в теле диалога.                     |
| **positiveText** | `string`      | `'Подтвердить'` | Текст кнопки «Да».                        |
| **negativeText** | `string`      | `'Отмена'`      | Текст кнопки «Нет».                       |
| **type**         | `ConfirmType` | `'default'`     | Семантика: info, success, warning, error. |
| **maskClosable** | `boolean`     | `true`          | Закрывать по клику по маске.              |

Результат: **true** — нажата положительная кнопка, **false** — отрицательная, крестик, маска или Esc.

## 2. TheModal — декларативная модалка

Компонент-обёртка над `Modal` (Ant Design Vue). Управляется через `v-model` и слоты.

### Props

| Prop             | Тип                                                        | По умолчанию | Описание                                  |
| ---------------- | ---------------------------------------------------------- | ------------ | ----------------------------------------- |
| **modelValue**   | `boolean`                                                  | —            | Показать/скрыть (v-model).                |
| **title**        | `string`                                                   | —            | Заголовок.                                |
| **content**      | `string`                                                   | —            | Текст тела при `preset="confirm"`.        |
| **size**         | `'small' \| 'medium' \| 'large' \| 'huge'`                 | `'medium'`   | Размер.                                   |
| **preset**       | `'confirm' \| 'dialog' \| 'card'`                          | `'dialog'`   | Тип модалки.                              |
| **positiveText** | `string`                                                   | —            | Текст «Подтвердить» (для preset confirm). |
| **negativeText** | `string`                                                   | —            | Текст «Отмена» (для preset confirm).      |
| **type**         | `'default' \| 'info' \| 'warning' \| 'error' \| 'success'` | `'default'`  | Семантика (иконка, акцент).               |
| **maskClosable** | `boolean`                                                  | `true`       | Закрытие по клику по маске.               |
| **closable**     | `boolean`                                                  | `true`       | Показывать крестик.                       |
| **loading**      | `boolean`                                                  | `false`      | Состояние загрузки на positive-кнопке.    |
| **showIcon**     | `boolean`                                                  | `true`       | Показывать иконку типа в заголовке.       |

### События

- **update:modelValue** — при изменении видимости.
- **positiveClick** — нажата «Подтвердить» (preset confirm).
- **negativeClick** — нажата «Отмена».
- **close** — закрытие (крестик, маска, Esc); эмитится и `update:modelValue(false)`.

### Слоты

- **default** — основной контент (для `preset="dialog"` и `preset="card"`). При `preset="confirm"` не используется, тело задаётся пропом **content**.
- **footer** — свой футер с кнопками.
- **header-extra** — доп. контент в заголовке.

## 3. Примеры TheModal

### Диалог с контентом (preset="dialog")

Для форм, текста, произвольной вёрстки:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import TheModal from '@/shared/ui/TheModal.vue'

const open = ref(false)
</script>

<template>
    <button @click="open = true">Открыть</button>
    <TheModal
        v-model="open"
        title="Заголовок"
        preset="dialog"
        size="medium"
    >
        <p>Любой контент: форма, таблица, текст.</p>
    </TheModal>
</template>
```

### Confirm в разметке (preset="confirm")

Когда модалка «привязана» к одной сцене и нужны свои подписи кнопок и логика:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import TheModal from '@/shared/ui/TheModal.vue'

const showConfirm = ref(false)

function onPositive() {
    // пользователь нажал «Подтвердить»
    showConfirm.value = false
}

function onNegative() {
    showConfirm.value = false
}
</script>

<template>
    <button @click="showConfirm = true">Удалить</button>
    <TheModal
        v-model="showConfirm"
        preset="confirm"
        title="Удалить запись?"
        content="Действие нельзя отменить."
        positive-text="Удалить"
        negative-text="Отмена"
        type="warning"
        @positive-click="onPositive"
        @negative-click="onNegative"
    />
</template>
```

### Асинхронное подтверждение (loading)

При preset="confirm" можно показать загрузку на кнопке «Подтвердить», пока идёт запрос:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import TheModal from '@/shared/ui/TheModal.vue'

const showConfirm = ref(false)
const loading = ref(false)

async function onPositive() {
    loading.value = true
    try {
        await doDelete()
        showConfirm.value = false
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <TheModal
        v-model="showConfirm"
        preset="confirm"
        title="Удалить?"
        content="Действие нельзя отменить."
        positive-text="Удалить"
        negative-text="Отмена"
        :loading="loading"
        type="warning"
        @positive-click="onPositive"
        @negative-click="showConfirm = false"
    />
</template>
```

### Свой футер (preset="dialog" + слот footer)

Для своих кнопок и поведения используйте слот **footer**:

```vue
<TheModal v-model="open" title="Редактирование" preset="dialog">
  <form>...</form>
  <template #footer>
    <TheButton @click="open = false">Отмена</TheButton>
    <TheButton type="primary" :loading="saving" @click="onSave">Сохранить</TheButton>
  </template>
</TheModal>
```

## Кратко

`confirm()` — из кода, без шаблона, `Promise<boolean>`. TheModal preset="confirm" — в разметке, свои кнопки. TheModal preset="dialog"/"card" — произвольный контент в default, свой footer при необходимости.
