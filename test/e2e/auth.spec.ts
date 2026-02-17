import { test, expect } from '@playwright/test'

test.describe('Auth', () => {
    test('страница входа отображается', async ({ page }) => {
        await page.goto('/auth/login')
        await expect(page.getByRole('heading', { name: /вход/i })).toBeVisible()
        await expect(page.getByLabel(/email/i)).toBeVisible()
        await expect(page.getByLabel(/пароль/i)).toBeVisible()
    })

    test('логин с моком API перенаправляет на главную', async ({ page }) => {
        await page.route('**/*auth/login', async (route) => {
            if (route.request().method() === 'POST') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        accessToken: 'e2e-token',
                        user: {
                            id: 'e2e-user',
                            email: 'e2e@example.com',
                            firstName: 'E2E',
                            lastName: 'User'
                        }
                    })
                })
            } else {
                await route.continue()
            }
        })

        await page.goto('/auth/login')
        await page.getByLabel(/email/i).fill('e2e@example.com')
        await page.getByLabel(/пароль/i).fill('password123')
        await page.getByLabel(/пароль/i).blur()
        await page.getByRole('button', { name: /войти/i }).click()

        await expect(page).toHaveURL(/\/(home)?$/, { timeout: 10000 })
    })
})
