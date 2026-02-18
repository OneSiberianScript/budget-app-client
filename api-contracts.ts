/**
 * Контракты API: типы запросов и ответов для каждой ручки.
 * Базовые сущности импортируются из api-types.ts.
 *
 * При ошибке (4xx/5xx) все ручки возвращают ApiErrorResponse.
 */

import type {
    User,
    Budget,
    BudgetMember,
    BudgetInvitation,
    Account,
    Category,
    Transaction,
    MonthlyPlan,
    MonthlyPlanItem,
    AuthRegisterResponse,
    AuthLoginResponse,
    AuthRefreshResponse,
    AuthChangePasswordResponse,
    SessionInfo,
    UserCreate,
    UserUpdate,
    BudgetCreate,
    BudgetUpdate,
    BudgetMemberCreate,
    BudgetMemberUpdate,
    BudgetInvitationCreate,
    BudgetInvitationUpdate,
    AccountCreate,
    AccountUpdate,
    CategoryCreate,
    CategoryUpdate,
    TransactionCreate,
    TransactionUpdate,
    MonthlyPlanCreate,
    MonthlyPlanUpdate,
    MonthlyPlanItemCreate,
    MonthlyPlanItemUpdate
} from './api-types'

// ============== Общий формат ошибки ==============

/**
 * Общий формат ответа API при ошибке (4xx/5xx).
 * Все ручки при неуспехе возвращают эту структуру.
 */
export interface ApiErrorResponse {
    error: { code: string; message: string }
}

// ============== Main ==============
// GET /api/ — тело запроса отсутствует. Ответ: plain text (string).

// ============== Auth ==============

/** Тело запроса POST /api/auth/register: email, пароль, имя и фамилия нового пользователя. */
export interface AuthRegisterRequest {
    email: string
    password: string
    firstName: string
    lastName: string
}

/** Успешный ответ POST /api/auth/register: токены и данные пользователя. */
export type AuthRegisterSuccessResponse = AuthRegisterResponse

/** Тело запроса POST /api/auth/login: учётные данные для входа. */
export interface AuthLoginRequest {
    email: string
    password: string
}

/** Успешный ответ POST /api/auth/login. */
export type AuthLoginSuccessResponse = AuthLoginResponse

/** POST /api/auth/refresh: тело запроса отсутствует, используется cookie refreshToken. Успешный ответ — AuthRefreshResponse. */
export type AuthRefreshSuccessResponse = AuthRefreshResponse

/** POST /api/auth/logout: тело запроса отсутствует. Ответ при успехе: 204, без тела. */

/** Успешный ответ GET /api/auth/sessions: список активных сессий пользователя. */
export type AuthSessionsListResponse = SessionInfo[]

/** Параметр пути для DELETE /api/auth/sessions/:sessionId — идентификатор сессии для отзыва. */
export interface AuthSessionIdParam {
    sessionId: string
}

/** DELETE /api/auth/sessions (без :sessionId): завершить все сессии кроме текущей. Ответ: 204, без тела. */

/** Тело запроса POST /api/auth/change-password: текущий и новый пароль. */
export interface AuthChangePasswordRequest {
    currentPassword: string
    newPassword: string
}

/** Успешный ответ POST /api/auth/change-password. */
export type AuthChangePasswordSuccessResponse = AuthChangePasswordResponse

/** Тело запроса POST /api/auth/confirm-email: токен подтверждения email. Ответ при успехе: 204, без тела. */
export interface AuthConfirmEmailRequest {
    token: string
}

// ============== Users ==============

/** Успешный ответ GET /api/users: список всех пользователей. */
export type GetUsersResponse = User[]

/** Параметр пути для ручек с идентификатором сущности (например, GET/PATCH/DELETE /api/users/:id). */
export interface IdParam {
    id: string
}

/** Успешный ответ GET /api/users/:id — один пользователь. */
export type GetUserByIdResponse = User

/** Тело запроса POST /api/users: данные для создания пользователя (включая пароль). */
export type PostUserRequest = UserCreate

/** Успешный ответ POST /api/users — созданный пользователь. */
export type PostUserResponse = User

/** Тело запроса PATCH /api/users/:id: частичное обновление профиля. */
export type PatchUserRequest = UserUpdate

/** Успешный ответ PATCH /api/users/:id — обновлённый пользователь. */
export type PatchUserResponse = User

/** DELETE /api/users/:id: ответ при успехе 204, без тела. */

// ============== Budgets ==============

/** Успешный ответ GET /api/budgets: список бюджетов текущего пользователя. */
export type GetBudgetsResponse = Budget[]

/** Успешный ответ GET /api/budgets/:id — один бюджет. */
export type GetBudgetByIdResponse = Budget

/** Тело запроса POST /api/budgets: название, валюта и опционально начальный баланс. */
export type PostBudgetRequest = BudgetCreate

/** Успешный ответ POST /api/budgets — созданный бюджет. */
export type PostBudgetResponse = Budget

/** Тело запроса PATCH /api/budgets/:id: частичное обновление бюджета. */
export type PatchBudgetRequest = BudgetUpdate

/** Успешный ответ PATCH /api/budgets/:id — обновлённый бюджет. */
export type PatchBudgetResponse = Budget

/** DELETE /api/budgets/:id: ответ при успехе 204, без тела. */

// ============== Accounts ==============

/** Успешный ответ GET /api/accounts: список счетов. */
export type GetAccountsResponse = Account[]

/** Успешный ответ GET /api/accounts/:id — один счёт. */
export type GetAccountByIdResponse = Account

/** Тело запроса POST /api/accounts: название, тип счёта и budgetId. */
export type PostAccountRequest = AccountCreate

/** Успешный ответ POST /api/accounts — созданный счёт. */
export type PostAccountResponse = Account

/** Тело запроса PATCH /api/accounts/:id: частичное обновление счёта. */
export type PatchAccountRequest = AccountUpdate

/** Успешный ответ PATCH /api/accounts/:id — обновлённый счёт. */
export type PatchAccountResponse = Account

/** DELETE /api/accounts/:id: ответ при успехе 204, без тела. */

// ============== Categories ==============

/** Успешный ответ GET /api/categories: список категорий. */
export type GetCategoriesResponse = Category[]

/** Успешный ответ GET /api/categories/:id — одна категория. */
export type GetCategoryByIdResponse = Category

/** Тело запроса POST /api/categories: название, тип, budgetId и опционально parentId. */
export type PostCategoryRequest = CategoryCreate

/** Успешный ответ POST /api/categories — созданная категория. */
export type PostCategoryResponse = Category

/** Тело запроса PATCH /api/categories/:id: частичное обновление категории. */
export type PatchCategoryRequest = CategoryUpdate

/** Успешный ответ PATCH /api/categories/:id — обновлённая категория. */
export type PatchCategoryResponse = Category

/** DELETE /api/categories/:id: ответ при успехе 204, без тела. */

// ============== Transactions ==============

/** Успешный ответ GET /api/transactions: список транзакций. */
export type GetTransactionsResponse = Transaction[]

/** Успешный ответ GET /api/transactions/:id — одна транзакция. */
export type GetTransactionByIdResponse = Transaction

/** Тело запроса POST /api/transactions: тип, сумма, дата, бюджет, счёт, категория и создатель. */
export type PostTransactionRequest = TransactionCreate

/** Успешный ответ POST /api/transactions — созданная транзакция. */
export type PostTransactionResponse = Transaction

/** Тело запроса PATCH /api/transactions/:id: частичное обновление транзакции. */
export type PatchTransactionRequest = TransactionUpdate

/** Успешный ответ PATCH /api/transactions/:id — обновлённая транзакция. */
export type PatchTransactionResponse = Transaction

/** DELETE /api/transactions/:id: ответ при успехе 204, без тела. */

// ============== Budget members ==============

/** Query-параметр для GET /api/budget-members: обязательный budgetId для списка участников бюджета. */
export interface BudgetMembersListQuery {
    budgetId: string
}

/** Успешный ответ GET /api/budget-members?budgetId=... — список участников бюджета. */
export type BudgetMembersListResponse = BudgetMember[]

/** Успешный ответ GET /api/budget-members/:id — один участник бюджета. */
export type GetBudgetMemberByIdResponse = BudgetMember

/** Тело запроса POST /api/budget-members: budgetId, userId и роль (editor/viewer). */
export type PostBudgetMemberRequest = BudgetMemberCreate

/** Успешный ответ POST /api/budget-members — созданный участник. */
export type PostBudgetMemberResponse = BudgetMember

/** Тело запроса PATCH /api/budget-members/:id: новая роль участника. */
export type PatchBudgetMemberRequest = BudgetMemberUpdate

/** Успешный ответ PATCH /api/budget-members/:id — обновлённый участник. */
export type PatchBudgetMemberResponse = BudgetMember

/** DELETE /api/budget-members/:id: ответ при успехе 204, без тела. */

// ============== Budget invitations ==============

/** Query-параметр для GET /api/budget-invitations: обязательный budgetId для списка приглашений. */
export interface BudgetInvitationsListQuery {
    budgetId: string
}

/** Успешный ответ GET /api/budget-invitations?budgetId=... — список приглашений в бюджет. */
export type BudgetInvitationsListResponse = BudgetInvitation[]

/** Успешный ответ GET /api/budget-invitations/:id — одно приглашение. */
export type GetBudgetInvitationByIdResponse = BudgetInvitation

/** Тело запроса POST /api/budget-invitations: budgetId, email и роль (editor/viewer). */
export type PostBudgetInvitationRequest = BudgetInvitationCreate

/** Успешный ответ POST /api/budget-invitations — созданное приглашение. */
export type PostBudgetInvitationResponse = BudgetInvitation

/** Тело запроса PATCH /api/budget-invitations/:id: обновление роли и/или статуса приглашения. */
export type PatchBudgetInvitationRequest = BudgetInvitationUpdate

/** Успешный ответ PATCH /api/budget-invitations/:id — обновлённое приглашение. */
export type PatchBudgetInvitationResponse = BudgetInvitation

/** DELETE /api/budget-invitations/:id: ответ при успехе 204, без тела. */

// ============== Monthly plans ==============

/** Успешный ответ GET /api/monthly-plans: список месячных планов. */
export type GetMonthlyPlansResponse = MonthlyPlan[]

/** Успешный ответ GET /api/monthly-plans/:id — один месячный план. */
export type GetMonthlyPlanByIdResponse = MonthlyPlan

/** Тело запроса POST /api/monthly-plans: год, месяц и budgetId. */
export type PostMonthlyPlanRequest = MonthlyPlanCreate

/** Успешный ответ POST /api/monthly-plans — созданный план. */
export type PostMonthlyPlanResponse = MonthlyPlan

/** Тело запроса PATCH /api/monthly-plans/:id: частичное обновление плана (год, месяц). */
export type PatchMonthlyPlanRequest = MonthlyPlanUpdate

/** Успешный ответ PATCH /api/monthly-plans/:id — обновлённый план. */
export type PatchMonthlyPlanResponse = MonthlyPlan

/** DELETE /api/monthly-plans/:id: ответ при успехе 204, без тела. */

// ============== Monthly plan items ==============

/** Успешный ответ GET /api/monthly-plan-items: список пунктов плана. */
export type GetMonthlyPlanItemsResponse = MonthlyPlanItem[]

/** Успешный ответ GET /api/monthly-plan-items/:id — один пункт плана. */
export type GetMonthlyPlanItemByIdResponse = MonthlyPlanItem

/** Тело запроса POST /api/monthly-plan-items: запланированная сумма, monthlyPlanId, categoryId и опционально actualAmountSnapshot. */
export type PostMonthlyPlanItemRequest = MonthlyPlanItemCreate

/** Успешный ответ POST /api/monthly-plan-items — созданный пункт плана. */
export type PostMonthlyPlanItemResponse = MonthlyPlanItem

/** Тело запроса PATCH /api/monthly-plan-items/:id: частичное обновление пункта плана. */
export type PatchMonthlyPlanItemRequest = MonthlyPlanItemUpdate

/** Успешный ответ PATCH /api/monthly-plan-items/:id — обновлённый пункт плана. */
export type PatchMonthlyPlanItemResponse = MonthlyPlanItem

/** DELETE /api/monthly-plan-items/:id: ответ при успехе 204, без тела. */
