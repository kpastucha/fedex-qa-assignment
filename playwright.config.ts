import { defineConfig, devices } from '@playwright/test';

const BASE_URL = 'http://localhost:4200';

export default defineConfig({
  testDir: './playwright/specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : 1,
  reporter: 'html',
  snapshotDir: './playwright/screenshots',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' }
    },
    {
      name: 'Desktop Safari',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Mobile Galaxy S24',
      use: { ...devices['Galaxy S24'] }
    },
    {
      name: 'Mobile iPhone 15 Pro',
      use: { ...devices['iPhone 15 Pro'] }
    }
  ],
  webServer: {
    command: 'npm start',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI
  }
});
