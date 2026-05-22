import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { apiConfig } from './framework/api';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: path.join('test-results', 'junit.xml') }],
  ],
  projects: [
    {
      name: 'api',
      testMatch: /api\/.*\.api\.spec\.ts/,
      use: {
        baseURL: apiConfig.baseUrl,
        extraHTTPHeaders: { 'Content-Type': 'application/json' },
      },
    },
    {
      name: 'chromium',
      testMatch: /\/(auth|search)\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL:
          process.env.BASE_URL ?? 'https://opensource-demo.orangehrmlive.com',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
  ],
  outputDir: 'test-results',
});
