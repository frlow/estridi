import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: ["tests/**/*"],
    include: ["src/**/*.test.ts"]
  },
})
