import { defineConfig } from '@playwright/test'

const timeout = 1000 * 50

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'line',
  testMatch: '*.spec.ts',
  expect: {
    timeout,
  },
  timeout,
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        channel: 'chromium',
        headless: false
      },
    },
  ],
})
