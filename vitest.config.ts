import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';

export default defineConfig({
  test: { include: ['lib/**/*.test.ts', 'tests/unit/**/*.test.ts'], environment: 'node' },
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
});
