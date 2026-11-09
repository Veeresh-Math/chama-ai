import { test, expect } from '@playwright/test';

test.describe('Dashboard — Security Redirects (unauthenticated)', () => {
  test('dashboard redirects to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('communities redirects to login', async ({ page }) => {
    await page.goto('/communities');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('gigs redirects to login', async ({ page }) => {
    await page.goto('/gigs');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('analytics redirects to login', async ({ page }) => {
    await page.goto('/analytics');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('copilot redirects to login', async ({ page }) => {
    await page.goto('/copilot');
    await expect(page).toHaveURL(/.*\/login/);
  });
});

test.describe('Signup Validation (client-side)', () => {
  test('shows validation error on short name', async ({ page }) => {
    await page.goto('/signup');
    await page.getByRole('button', { name: /sign up/i }).click();
    await expect(page.getByText(/please enter your name/i)).toBeVisible();
  });
});
