export interface Transaction {
    id: string
    budgetId: string
    accountId: string
    categoryId: string
    amount: number
    date: string
    note?: string
    createdAt: string
    updatedAt: string
}
