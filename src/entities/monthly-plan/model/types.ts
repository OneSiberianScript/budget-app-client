export interface MonthlyPlan {
    id: string
    budgetId: string
    month: string
    createdAt: string
    updatedAt: string
}

export interface MonthlyPlanItem {
    id: string
    monthlyPlanId: string
    categoryId: string
    limitCents: number
    createdAt: string
    updatedAt: string
}
