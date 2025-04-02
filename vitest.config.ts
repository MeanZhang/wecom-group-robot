import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    watch: false,
    coverage: {
      enabled: true,
      provider: 'istanbul',
      reporter: ['text', 'html', 'clover', 'json-summary']
    }
  }
})
