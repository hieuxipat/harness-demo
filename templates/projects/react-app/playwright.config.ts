import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:{{port}}',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    port: {{port}},
    reuseExistingServer: !process.env.CI,
  },
});
