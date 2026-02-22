/**
 * API base URL and timeout from env. Base URL must include /api prefix.
 * Для прода/тестового бэкенда задайте VITE_API_BASE_URL (например https://api.kkors.ru/api) —
 * все запросы, включая логин (POST /auth/login), пойдут на этот хост.
 */
export const apiConfig = {
    baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
    timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS) || 5000
} as const
