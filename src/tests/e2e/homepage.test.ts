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

  test('nav anchor links scroll to their sections', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });

    // Click Features -> should scroll to #features
    await nav.getByRole('link', { name: 'Product', exact: true }).click();
    await expect(page).toHaveURL(/#features/);
    await expect(page.locator('#features')).toBeVisible();

    // Click How it works -> should scroll to #how
    await nav.getByRole('link', { name: 'How it works', exact: true }).click();
    await expect(page).toHaveURL(/#how/);
    await expect(page.locator('#how')).toBeVisible();

    // Click Security -> should scroll to #security
    await nav.getByRole('link', { name: 'Security', exact: true }).click();
    await expect(page).toHaveURL(/#security/);
    await expect(page.locator('#security')).toBeVisible();

    // Click Pricing -> should scroll to #pricing
    await nav.getByRole('link', { name: 'Pricing', exact: true }).click();
    await expect(page).toHaveURL(/#pricing/);
    await expect(page.locator('#pricing')).toBeVisible();

    // Click FAQ -> should scroll to #faq
    await nav.getByRole('link', { name: 'FAQ', exact: true }).click();
    await expect(page).toHaveURL(/#faq/);
    await expect(page.locator('#faq')).toBeVisible();
  });

  test('all features visible in grid', async ({ page }) => {
    await page.goto('/');
    await page.locator('#features').scrollIntoViewIfNeeded();
    const features = page.locator('#features');
    // All 5 features visible at once (no hidden picker)
    await expect(features.getByText('An agent that transacts')).toBeVisible();
    await expect(features.getByText('Savings circles on autopilot')).toBeVisible();
    await expect(features.getByText('Gig milestone escrow')).toBeVisible();
    await expect(features.getByText('Trust scoring that travels')).toBeVisible();
    await expect(features.getByText('Agent-ready by design')).toBeVisible();
  });
});
