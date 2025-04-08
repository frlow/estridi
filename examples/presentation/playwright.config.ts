import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  reporter: 'dot',
  timeout: 1000*1000,
  webServer: {
    command: 'pnpx serve src',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },

  use: {
    baseURL: 'http://localhost:3000',
    headless: false,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
