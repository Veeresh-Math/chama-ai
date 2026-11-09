import { test, expect } from '@playwright/test';

test.describe('Cham.ai Landing Page', () => {
  test('loads and displays hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Pool money.');
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
  });

  test('displays all major sections in order', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav.getByRole('link', { name: 'Product', exact: true })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'How it works', exact: true })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Pricing', exact: true })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'FAQ', exact: true })).toBeVisible();
  });

  test('navigation links are present', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav.getByRole('link', { name: 'Sign in', exact: true })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Sign up', exact: true })).toBeVisible();
  });

  test('hero call-to-action is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /start your collective/i })).toBeVisible();
  });

  test('paypal hackathon badge is present', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('PayPal AI Hackathon 2026 Submission')).toBeVisible();
  });
});
