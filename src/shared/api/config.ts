/**
 * API base URL and timeout from env. Base URL must include /api prefix.
 */
export const apiConfig = {
    baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
    timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS) || 5000
} as const
