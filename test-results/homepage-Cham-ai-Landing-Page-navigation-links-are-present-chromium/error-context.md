# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepage.test.ts >> Cham.ai Landing Page >> navigation links are present
- Location: src\tests\e2e\homepage.test.ts:19:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Sign in', exact: true })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Sign in', exact: true }) with timeout 5000ms
  - waiting for getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Sign in', exact: true })

```

```yaml
- text: missing required error components, refreshing...
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Cham.ai Landing Page', () => {
  4  |   test('loads and displays hero section', async ({ page }) => {
  5  |     await page.goto('/');
  6  |     await expect(page.locator('h1')).toContainText('Pool money.');
  7  |     await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
  8  |   });
  9  | 
  10 |   test('displays all major sections in order', async ({ page }) => {
  11 |     await page.goto('/');
  12 |     const nav = page.getByRole('navigation', { name: 'Primary' });
  13 |     await expect(nav.getByRole('link', { name: 'Product', exact: true })).toBeVisible();
  14 |     await expect(nav.getByRole('link', { name: 'How it works', exact: true })).toBeVisible();
  15 |     await expect(nav.getByRole('link', { name: 'Pricing', exact: true })).toBeVisible();
  16 |     await expect(nav.getByRole('link', { name: 'FAQ', exact: true })).toBeVisible();
  17 |   });
  18 | 
  19 |   test('navigation links are present', async ({ page }) => {
  20 |     await page.goto('/');
  21 |     const nav = page.getByRole('navigation', { name: 'Primary' });
> 22 |     await expect(nav.getByRole('link', { name: 'Sign in', exact: true })).toBeVisible();
     |                                                                           ^ Error: expect(locator).toBeVisible() failed
  23 |     await expect(nav.getByRole('link', { name: 'Sign up', exact: true })).toBeVisible();
  24 |   });
  25 | 
  26 |   test('hero call-to-action is visible', async ({ page }) => {
  27 |     await page.goto('/');
  28 |     await expect(page.getByRole('link', { name: /start your collective/i })).toBeVisible();
  29 |   });
  30 | 
  31 |   test('paypal hackathon badge is present', async ({ page }) => {
  32 |     await page.goto('/');
  33 |     await expect(page.getByText('PayPal AI Hackathon 2026 Submission')).toBeVisible();
  34 |   });
  35 | 
  36 |   test('nav anchor links scroll to their sections', async ({ page }) => {
  37 |     await page.goto('/');
  38 |     const nav = page.getByRole('navigation', { name: 'Primary' });
  39 | 
  40 |     // Click Features -> should scroll to #features
  41 |     await nav.getByRole('link', { name: 'Product', exact: true }).click();
  42 |     await expect(page).toHaveURL(/#features/);
  43 |     await expect(page.locator('#features')).toBeVisible();
  44 | 
  45 |     // Click How it works -> should scroll to #how
  46 |     await nav.getByRole('link', { name: 'How it works', exact: true }).click();
  47 |     await expect(page).toHaveURL(/#how/);
  48 |     await expect(page.locator('#how')).toBeVisible();
  49 | 
  50 |     // Click Security -> should scroll to #security
  51 |     await nav.getByRole('link', { name: 'Security', exact: true }).click();
  52 |     await expect(page).toHaveURL(/#security/);
  53 |     await expect(page.locator('#security')).toBeVisible();
  54 | 
  55 |     // Click Pricing -> should scroll to #pricing
  56 |     await nav.getByRole('link', { name: 'Pricing', exact: true }).click();
  57 |     await expect(page).toHaveURL(/#pricing/);
  58 |     await expect(page.locator('#pricing')).toBeVisible();
  59 | 
  60 |     // Click FAQ -> should scroll to #faq
  61 |     await nav.getByRole('link', { name: 'FAQ', exact: true }).click();
  62 |     await expect(page).toHaveURL(/#faq/);
  63 |     await expect(page.locator('#faq')).toBeVisible();
  64 |   });
  65 | 
  66 |   test('all features visible in grid', async ({ page }) => {
  67 |     await page.goto('/');
  68 |     await page.locator('#features').scrollIntoViewIfNeeded();
  69 |     const features = page.locator('#features');
  70 |     // All 5 features visible at once (no hidden picker)
  71 |     await expect(features.getByText('An agent that transacts')).toBeVisible();
  72 |     await expect(features.getByText('Savings circles on autopilot')).toBeVisible();
  73 |     await expect(features.getByText('Gig milestone escrow')).toBeVisible();
  74 |     await expect(features.getByText('Trust scoring that travels')).toBeVisible();
  75 |     await expect(features.getByText('Agent-ready by design')).toBeVisible();
  76 |   });
  77 | });
  78 | 
```