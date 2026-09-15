// @ts-check
import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  // Navigates directly to the baseURL (Vercel deployment)
  await page.goto('/');

  // Verify that main content body is loaded
  const body = page.locator('body');
  await expect(body).toBeVisible();
});

test('button click works and navigates to login', async ({ page }) => {
  await page.goto('/');

  // Click on the Login button in navigation header
  await page.click('text=Login');

  // Verify that URL updates to /login
  await expect(page).toHaveURL(/.*login/);
});

