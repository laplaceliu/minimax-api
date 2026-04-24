import { defineConfig } from 'vitest/config'
import dotenv from 'dotenv'
import path from 'path'

// Load .env.local first (overrides .env)
dotenv.config({ path: path.resolve(__dirname, '.env.local') })

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
})
