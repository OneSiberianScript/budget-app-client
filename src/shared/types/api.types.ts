/**
 * Типы сущностей API для фронтенда (budget-app-server).
 * Соответствуют моделям Sequelize и ответам контроллеров.
 */

// ============== Enums (литералы API) ==============

export type BudgetMemberRole = 'owner' | 'editor' | 'viewer'
export type BudgetInvitationRole = 'editor' | 'viewer'
export type BudgetInvitationStatus = 'pending' | 'accepted' | 'rejected'
export type AccountType = 'cash' | 'bank' | 'credit' | 'saving'
export type CategoryType = 'expense' | 'income' | 'transfer' | 'saving'
export type TransactionType = 'expense' | 'income' | 'transfer'

// ============== Entities (ответы CRUD) ==============

export interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    phone?: string | null
    telegram?: string | null
    emailConfirmedAt?: string | null
    createdAt: string
    updatedAt: string
}

/** Пользователь в ответах auth (без passwordHash) */
export interface AuthUser {
    id: string
    email: string
    firstName: string
    lastName: string
}

export interface Budget {
    id: string
    name: string
    currency: string
    initialBalance: string
    ownerId: string
    createdAt: string
    updatedAt: string
}

export interface BudgetMember {
    id: string
    role: BudgetMemberRole
    budgetId: string
    userId: string
    createdAt: string
    updatedAt: string
}

export interface BudgetInvitation {
    id: string
    email: string
    role: BudgetInvitationRole
    status: BudgetInvitationStatus
    budgetId: string
    createdAt: string
    updatedAt: string
}

export interface Account {
    id: string
    name: string
    type: AccountType
    budgetId: string
    createdAt: string
    updatedAt: string
    deletedAt?: string | null
}

export interface Category {
    id: string
    name: string
    type: CategoryType
    parentId: string | null
    budgetId: string
    createdAt: string
    updatedAt: string
    deletedAt?: string | null
}

export interface Transaction {
    id: string
    type: TransactionType
    amount: string
    occurredAt: string
    transferGroupId: string | null
    createdById: string
    updatedById: string | null
    budgetId: string
    accountId: string
    categoryId: string
    createdAt: string
    updatedAt: string
    deletedAt?: string | null
}

export interface MonthlyPlan {
    id: string
    year: number
    month: number
    budgetId: string
    createdAt: string
    updatedAt: string
}

export interface MonthlyPlanItem {
    id: string
    plannedAmount: string
    actualAmountSnapshot: string | null
    monthlyPlanId: string
    categoryId: string
    createdAt: string
    updatedAt: string
}

// ============== Auth API responses ==============

export interface AuthRegisterResponse {
    accessToken: string
    sessionId: string
    user: AuthUser
}

export interface AuthLoginResponse {
    accessToken: string
    sessionId: string
}

export interface AuthRefreshResponse {
    accessToken: string
    sessionId: string
}

export interface AuthChangePasswordResponse {
    accessToken: string
    sessionId: string
}

/** Элемент списка GET /api/auth/sessions */
export interface SessionInfo {
    id: string
    createdAt: string
    lastUsedAt: string | null
    userAgent: string | null
    ip: string | null
    expiresAt: string
}

// ============== Request bodies (для создания/обновления) ==============

export type UserCreate = Pick<User, 'email' | 'firstName' | 'lastName'> & { password: string }
export type UserUpdate = Partial<Pick<User, 'firstName' | 'lastName' | 'phone' | 'telegram'>>

export type BudgetCreate = Pick<Budget, 'name' | 'currency'> & { initialBalance?: string }
export type BudgetUpdate = Partial<Pick<Budget, 'name' | 'currency' | 'initialBalance'>>

export type BudgetMemberCreate = Pick<BudgetMember, 'budgetId' | 'userId' | 'role'>
export type BudgetMemberUpdate = Pick<BudgetMember, 'role'>

export type BudgetInvitationCreate = Pick<BudgetInvitation, 'budgetId' | 'email' | 'role'>
export type BudgetInvitationUpdate = Partial<Pick<BudgetInvitation, 'role' | 'status'>>

export type AccountCreate = Pick<Account, 'name' | 'type' | 'budgetId'>
export type AccountUpdate = Partial<Pick<Account, 'name' | 'type'>>

export type CategoryCreate = Pick<Category, 'name' | 'type' | 'budgetId'> & { parentId?: string | null }
export type CategoryUpdate = Partial<Pick<Category, 'name' | 'type' | 'parentId'>>

export type TransactionCreate = Pick<
    Transaction,
    'type' | 'amount' | 'occurredAt' | 'budgetId' | 'accountId' | 'categoryId'
> & {
    transferGroupId?: string | null
    createdById: string
}
export type TransactionUpdate = Partial<
    Pick<Transaction, 'type' | 'amount' | 'occurredAt' | 'accountId' | 'categoryId' | 'updatedById'>
>

export type MonthlyPlanCreate = Pick<MonthlyPlan, 'year' | 'month' | 'budgetId'>
export type MonthlyPlanUpdate = Partial<Pick<MonthlyPlan, 'year' | 'month'>>

export type MonthlyPlanItemCreate = Pick<MonthlyPlanItem, 'plannedAmount' | 'monthlyPlanId' | 'categoryId'> & {
    actualAmountSnapshot?: string | null
}
export type MonthlyPlanItemUpdate = Partial<
    Pick<MonthlyPlanItem, 'plannedAmount' | 'actualAmountSnapshot' | 'categoryId'>
>

// ============== Errors ==============

export interface ApiError {
    message: string
    code?: string
}
