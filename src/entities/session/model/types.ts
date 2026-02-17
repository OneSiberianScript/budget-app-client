/** User data returned after login/register/refresh */
export interface SessionUser {
    id: string
    email: string
    firstName?: string
    lastName?: string
}
