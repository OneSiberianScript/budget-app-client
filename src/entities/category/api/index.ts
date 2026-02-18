import { request } from '@/shared/api/request'
import type { CategoryCreate, CategoryUpdate } from '@/shared/types'

import type { Category } from '../model/types'

/**
 * Fetch categories for a budget.
 */
export async function fetchCategories(budgetId: string): Promise<Category[]> {
    const data = await request<Category[]>({ method: 'GET', url: '/categories', params: { budgetId } })
    return data
}

/**
 * Fetch a single category by id.
 */
export async function fetchCategoryById(id: string): Promise<Category> {
    return request<Category>({ method: 'GET', url: `/categories/${id}` })
}

/**
 * Create a category.
 */
export async function createCategory(payload: CategoryCreate): Promise<Category> {
    return request<Category>({ method: 'POST', url: '/categories', data: payload })
}

/**
 * Update a category.
 */
export async function updateCategory(id: string, payload: CategoryUpdate): Promise<Category> {
    return request<Category>({ method: 'PATCH', url: `/categories/${id}`, data: payload })
}

/**
 * Delete a category.
 */
export async function deleteCategory(id: string): Promise<void> {
    return request({ method: 'DELETE', url: `/categories/${id}` })
}
