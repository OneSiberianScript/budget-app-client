# Приведение проекта в соответствие с openapi.yaml + FRONTEND_SYNC.md

## Context

Расхождения двух видов:
- **Код расходится с контрактом** (баги): `BudgetListItem.role` теряется → `currentBudgetRole` всегда `null` → `isOwner` в BudgetSettingsPage никогда не работает; `changePassword` игнорирует новые токены; 429 для `resendConfirmEmail` читает `data.retryAfter` вместо `data.error.retryAfter`; страница принятия инвайта использует устаревший API.
- **Контракт (openapi.yaml) неполный**: не задокументированы реальные поля (`invitedById`, `externalToken`, `expiresAt` в `BudgetInvitation`; `User` в `BudgetMember`), реальные эндпоинты (`/accept`, `/reject`, `by-token`), и обновлённый тип ответа `GET /budgets/{id}`.
- **Новый flow приглашений** (FRONTEND_SYNC.md §4–5): ссылка в письме теперь содержит `externalToken`, загрузка инвайта должна идти через `GET /budget-invitations/by-token/:token`, а принятие — через `POST /:id/accept` с реальным `id` из ответа.

---

## 1. `openapi.yaml`

#### 1а. Схема `BudgetInvitation` — добавить поля
```yaml
invitedById: { type: string, format: uuid, nullable: true }
externalToken: { type: string, format: uuid }
expiresAt: { type: string, format: date-time }
```

#### 1б. Схема `BudgetMember` — добавить вложенный User
```yaml
User:
  type: object
  properties:
    id: { type: string, format: uuid }
    email: { type: string, format: email }
    firstName: { type: string }
    lastName: { type: string }
```

#### 1в. `GET /budgets/{id}` — изменить ответ с `Budget` на `BudgetListItem`
```yaml
schema: { $ref: '#/components/schemas/BudgetListItem' }
```

#### 1г. Новая схема `AcceptInvitationResponse`
```yaml
AcceptInvitationResponse:
  type: object
  properties:
    budgetId: { type: string, format: uuid }
    role: { $ref: '#/components/schemas/BudgetMemberRole' }
```

#### 1д. Новая схема `BudgetInvitationWithBudget` (ответ by-token)
```yaml
BudgetInvitationWithBudget:
  allOf:
    - $ref: '#/components/schemas/BudgetInvitation'
    - type: object
      properties:
        budget:
          type: object
          properties:
            name: { type: string }
```

#### 1е. Три новых эндпоинта
- `GET /budget-invitations/by-token/{token}` → `BudgetInvitationWithBudget` (403/404)
- `POST /budget-invitations/{id}/accept` → `AcceptInvitationResponse` (400/401/403/404)
- `POST /budget-invitations/{id}/reject` → `{ ok: boolean }` (401/404)

#### 1ж. 429 для resend-confirm-email — `retryAfter` внутри `error`
```yaml
'429':
  description: Rate limited
  content:
    application/json:
      schema:
        type: object
        properties:
          error:
            type: object
            properties:
              code: { type: string }
              message: { type: string }
              retryAfter: { type: integer }
```

---

## 2. `src/shared/types/api.types.ts`

**2а.** `BudgetListItem` после `Budget`:
```typescript
export interface BudgetListItem extends Budget {
    role: BudgetMemberRole
}
```

**2б.** `externalToken` в `BudgetInvitation`:
```typescript
invitedById: string | null
externalToken: string
expiresAt: string
```

**2в.** `BudgetInvitationWithBudget`:
```typescript
export interface BudgetInvitationWithBudget extends BudgetInvitation {
    budget: { name: string }
}
```

**2г.** `ResendConfirmEmail429Body` — `retryAfter` переезжает внутрь `error`:
```typescript
export interface ResendConfirmEmail429Body {
    error: { code: string; message: string; retryAfter?: number }
}
```

---

## 3. `src/entities/budget/api/index.ts`

- `fetchBudgets()` → `Promise<BudgetListItem[]>`
- `fetchBudgetById()` → `Promise<BudgetListItem>` (бэкенд теперь возвращает `role`)

---

## 4. `src/entities/budget/model/store.ts`

**4а.** `budgets`: `ref<Budget[]>` → `ref<BudgetListItem[]>`

**4б.** `setBudgets(list: BudgetListItem[])` и `setBudget(budget: BudgetListItem)`

**4в.** `setCurrentBudget` — автоподтягивание роли из списка:
```typescript
function setCurrentBudget(budgetId: string | null, role: BudgetRole | null = null) {
    currentBudgetId.value = budgetId
    if (role !== null) {
        currentBudgetRole.value = role
    } else {
        const found = budgetId ? budgets.value.find((b) => b.id === budgetId) : null
        currentBudgetRole.value = (found?.role as BudgetRole) ?? null
    }
    // sessionStorage logic unchanged
}
```

**4г.** В `fetchBudgets()` при автовыборе первого бюджета:
```typescript
setCurrentBudget(safeList[0].id)  // было: setCurrentBudget(safeList[0].id, null)
```

> `BudgetSwitcher.vue` менять не нужно — `setCurrentBudget(id, null)` автоматически подтянет роль из `budgets`.

---

## 5. `src/entities/budget-invitation/api/index.ts`

Добавить:
```typescript
export async function getInvitationByToken(token: string): Promise<BudgetInvitationWithBudget> {
    return request<BudgetInvitationWithBudget>({
        method: 'GET',
        url: `/budget-invitations/by-token/${token}`
    })
}
```

Экспортировать из `src/entities/budget-invitation/index.ts`.

---

## 6. `src/pages/invitation/ui/IncomingInvitationPage.vue`

**Было** (некорректно после FRONTEND_SYNC.md §4):
```typescript
invitation.value = await getInvitationById(token.value)   // token ≠ invitation.id
await invitationStore.acceptInvitation(token.value)        // token ≠ invitation.id
await invitationStore.rejectInvitation(token.value)        // token ≠ invitation.id
```

**Стало**:
```typescript
import { getInvitationByToken } from '@/entities/budget-invitation'
// ...
const invitation = ref<BudgetInvitationWithBudget | null>(null)
// onMounted:
invitation.value = await getInvitationByToken(token.value)  // GET by-token → реальный id
// handleAccept:
await invitationStore.acceptInvitation(invitation.value!.id)
// handleReject:
await invitationStore.rejectInvitation(invitation.value!.id)
```

Опционально: добавить `{{ invitation.budget.name }}` в шаблон.

---

## 7. `src/entities/session/api/index.ts`

**7а.** Исправить `resendConfirmEmail` — путь к `retryAfter`:
```typescript
// было
const res = (err as { response?: { status?: number; data?: { retryAfter?: number } } }).response
throw new ResendConfirmEmailRateLimitError(res.data?.retryAfter)

// стало
const res = (err as { response?: { status?: number; data?: { error?: { retryAfter?: number } } } }).response
throw new ResendConfirmEmailRateLimitError(res.data?.error?.retryAfter)
```

**7б.** `changePassword` возвращает токены:
```typescript
export async function changePassword(
    currentPassword: string,
    newPassword: string
): Promise<AuthChangePasswordResponse> {
    return request<AuthChangePasswordResponse>({ ... })
}
```

---

## 8. `src/features/auth/change-password/ui/ChangePasswordForm.vue`

```typescript
const sessionStore = useSessionStore()  // добавить

async function onSubmit(values: ChangePasswordFormValues) {
    try {
        const res = await changePassword(values.currentPassword, values.newPassword)
        sessionStore.setAccessToken(res.accessToken, res.sessionId)  // ← добавить
        // ... остальное без изменений
    }
}
```

`sessionStore.setAccessToken` — `src/entities/session/model/store.ts:28`.

---

## Что намеренно не меняется

| Тема | Причина |
|---|---|
| Users CRUD | Нет UI, likely admin-only |
| `POST /budget-members` | Участники создаются через invitation flow |
| `GET /budget-members/{id}` | Не нужен текущему UI |
| `GET/PATCH/DELETE /monthly-plans/{id}` | Планы доступны по year/month, не по ID |
| `GET /monthly-plan-items/{id}` | Не нужен текущему UI |
| `toApiError` в `shared/api/errors.ts` | Уже читает `data.error.{code,message}` — изменений не требует |

---

## Порядок выполнения

1. `openapi.yaml`
2. `api.types.ts` (BudgetListItem, BudgetInvitationWithBudget, поля BudgetInvitation, ResendConfirmEmail429Body)
3. `budget/api/index.ts` (типы возвращаемых значений)
4. `budget/model/store.ts` (BudgetListItem + авто-role)
5. `budget-invitation/api/index.ts` + `index.ts` (getInvitationByToken)
6. `session/api/index.ts` (retryAfter path + changePassword return type)
7. `IncomingInvitationPage.vue` (новый двухшаговый flow)
8. `ChangePasswordForm.vue` (сохранить токены)

---

## Верификация

```bash
npm run build     # TypeScript errors не должно быть
npm run lint      # Линт чист
npm run test:run  # Unit-тесты проходят
```

Ручные:
1. **BudgetSettingsPage** — `isOwner` корректен, кнопки редактирования видны для owner
2. **BudgetSwitcher** — при переключении `currentBudgetRole` меняется
3. **IncomingInvitationPage** — принятие инвайта по `externalToken` из письма работает
4. **ConfirmEmailPage** — при 429 таймер обратного отсчёта запускается
5. **ChangePasswordForm** — токен обновляется, сессия не сбрасывается
