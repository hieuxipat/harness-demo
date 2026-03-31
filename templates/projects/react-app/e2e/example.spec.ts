import { test, expect } from '@playwright/test';

test.describe('Example page', () => {
  test('should display the counter', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Example Feature')).toBeVisible();
    await expect(page.getByText('0')).toBeVisible();
  });

  test('should increment and decrement', async ({ page }) => {
    await page.goto('/');

    await page.getByText('+').click();
    await expect(page.getByText('1')).toBeVisible();

    await page.getByText('-').click();
    await expect(page.getByText('0')).toBeVisible();
  });
});
