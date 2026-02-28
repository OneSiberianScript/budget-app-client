# Frontend Sync — проверка соответствия фронтенда бэкенду

Этот документ обновляется при изменениях API-контрактов. Используй его как чеклист при синхронизации клиентского кода с сервером.

---

## Формат ошибок

**Все ошибки** от API имеют структуру:

```json
{ "error": { "code": "ERROR_CODE", "message": "Human-readable message" } }
```

Для ошибки 429 (rate limit) в объект `error` добавляется доп. поле:

```json
{ "error": { "code": "RATE_LIMITED", "message": "...", "retryAfter": 42 } }
```

### Таблица error codes

| Endpoint | HTTP | code | Условие |
|----------|------|------|---------|
| `POST /auth/register` | 400 | `MISSING_FIELDS` | Не заполнены обязательные поля |
| `POST /auth/register` | 409 | `EMAIL_ALREADY_IN_USE` | Email уже зарегистрирован |
| `POST /auth/login` | 401 | `INVALID_CREDENTIALS` | Нет email/пароля или неверные данные |
| `POST /auth/refresh` | 401 | `UNAUTHORIZED` | Нет cookie / невалидный / просроченный токен |
| `DELETE /auth/sessions` | 401 | `UNAUTHORIZED` | Нет refresh cookie |
| `POST /auth/change-password` | 400 | `MISSING_FIELDS` | Нет currentPassword или newPassword |
| `POST /auth/change-password` | 400 | `PASSWORD_TOO_SHORT` | newPassword < 8 символов |
| `POST /auth/change-password` | 401 | `INVALID_CREDENTIALS` | Неверный currentPassword |
| `POST /auth/confirm-email` | 400 | `MISSING_FIELDS` | Нет токена в теле |
| `POST /auth/confirm-email` | 400 | `INVALID_TOKEN` | Токен не найден или просрочен |
| `POST /auth/resend-confirm-email` | 400 | `EMAIL_ALREADY_CONFIRMED` | Email уже подтверждён |
| `POST /auth/resend-confirm-email` | 429 | `RATE_LIMITED` | Повторный запрос раньше cooldown (60 сек) |
| Любой защищённый endpoint | 401 | `UNAUTHORIZED` | Нет/невалидный access token |
| Доступ к чужому ресурсу | 403 | `FORBIDDEN` | Нет прав |
| Ресурс не найден | 404 | `NOT_FOUND` | Ресурс не существует |

> **Важно:** до этого изменения auth-контроллер возвращал `{ message: "..." }` без поля `error`. Клиентский код, который читал `response.message` или `response.data.message`, необходимо переписать на `response.data.error.message` и `response.data.error.code`.

---

## Изменения API (текущий PR)

### 1. Нормализация email

Теперь email **всегда хранится в нижнем регистре**. При регистрации и логине email приводится к lowercase перед сохранением/поиском.

**Влияние на фронтенд:** нет, если клиент не сравнивает email вручную. Убедись, что UI не чувствителен к регистру при отображении email.

---

### 2. `GET /budgets/:id` — добавлено поле `role`

Ответ теперь соответствует схеме `BudgetListItem` (как у `GET /budgets`):

```json
{
  "id": "uuid",
  "name": "Мой бюджет",
  "currency": "RUB",
  "ownerId": "uuid",
  "role": "owner",
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Влияние:** фронтенд может теперь получать роль из одиночного запроса бюджета, не обращаясь к списку.

---

### 3. `BudgetInvitation` — новые поля

Схема инвайта расширена:

| Поле | Тип | Описание |
|------|-----|---------|
| `invitedById` | `uuid \| null` | ID пользователя, отправившего инвайт |
| `externalToken` | `uuid` | Опаковый токен для ссылки из письма |
| `expiresAt` | `date-time` | Когда инвайт истекает |

---

### 4. Email-ссылка приглашения изменилась

Ссылка в письме теперь содержит `externalToken` вместо `id` инвайта:

```
Было:   {FRONTEND_URL}/invitations/accept?token={invitationId}
Стало:  {FRONTEND_URL}/invitations/accept?token={externalToken}
```

**Требуемые изменения на фронтенде:**
- Страница `/invitations/accept` читает `token` из query string — это уже `externalToken`
- Для получения данных инвайта вызвать новый endpoint: `GET /api/budget-invitations/by-token/:token`
- После получения `invitationId` из ответа — вызвать `POST /api/budget-invitations/:id/accept`

---

### 5. Новый endpoint: `GET /budget-invitations/by-token/:token`

```
GET /api/budget-invitations/by-token/{externalToken}
Authorization: Bearer <access_token>
```

Возвращает инвайт с включёнными данными бюджета (`Budget.name`). Доступен только авторизованному пользователю, email которого совпадает с `invitation.email`.

Ошибки: `403 FORBIDDEN` (не тот email), `404 NOT_FOUND` (токен не существует).

---

### 6. `GET /budget-invitations/:id` — доступен приглашённому

Теперь endpoint доступен не только членам бюджета, но и самому приглашённому (проверка по email). Требует только `Authorization: Bearer <token>`.

Ошибки: `403 FORBIDDEN` (не член бюджета И email не совпадает).

---

## Чеклист обновлений для фронтенда

- [ ] **Обработка ошибок:** везде заменить `response.message` / `response.data.message` на `response.data.error.message` и `response.data.error.code`
- [ ] **Auth errors:** обновить обработку 400/401/409 в форме регистрации и логина под новые коды (`MISSING_FIELDS`, `EMAIL_ALREADY_IN_USE`, `INVALID_CREDENTIALS`)
- [ ] **Rate limit 429:** на странице resend-confirm-email читать `error.retryAfter` вместо корневого `retryAfter`
- [ ] **Email-ссылка инвайта:** страница `/invitations/accept` должна вызывать `GET /api/budget-invitations/by-token/:token` для загрузки инвайта
- [ ] **Принятие инвайта:** после `GET by-token` использовать полученный `invitation.id` для вызова `POST /:id/accept`
- [ ] **Детальная страница бюджета:** поле `role` теперь доступно и в `GET /budgets/:id`, не только в списке
- [ ] **Типы:** обновить `BudgetInvitation` в `api-types.ts` — добавить `invitedById`, `externalToken`, `expiresAt`
