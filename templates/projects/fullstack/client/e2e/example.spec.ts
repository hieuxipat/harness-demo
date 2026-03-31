import { test, expect } from '@playwright/test';

test('should load the app', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('{{project_name}}')).toBeVisible();
});
