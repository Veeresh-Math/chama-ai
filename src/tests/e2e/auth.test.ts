import { test, expect } from '@playwright/test';

test.describe('Auth Pages', () => {
  test('login page renders with form fields', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('signup page renders with form fields', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible();
    await expect(page.getByLabel(/your name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible();
  });

  test('forgot password page renders reset form', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.getByRole('heading', { name: /reset your password/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });

  test('reset password page without token shows invalid link', async ({ page }) => {
    await page.goto('/reset-password');
    await expect(page.getByRole('heading', { name: /link isn't valid/i })).toBeVisible();
  });

  test('login shows validation error on empty submit', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText(/please enter a valid email address/i)).toBeVisible();
  });

  test('signup shows validation error on short name', async ({ page }) => {
    await page.goto('/signup');
    await page.getByRole('button', { name: /sign up/i }).click();
    await expect(page.getByText(/please enter your name/i)).toBeVisible();
  });
});

test.describe('Protected Routes — Security', () => {
  test('dashboard redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('communities redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/communities');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('gigs redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/gigs');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('analytics redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/analytics');
    await expect(page).toHaveURL(/.*\/login/);
  });
});
