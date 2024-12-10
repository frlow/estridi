import { defineConfig, devices } from '@playwright/test'

const baseURL = 'https://example.com'
const timeout = 5 * 1000

export default defineConfig({
  testDir: './src/targets/test/',
  fullyParallel: true,
  reporter: 'line',
  testMatch: '*.spec.ts',
  expect: {
    timeout,
  },
  timeout,
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        channel: 'chromium',
        headless: true, //CI,
      },
    },
  ],
})
