import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

// `vite.config.js` exports a callback, which `mergeConfig` cannot merge, so
// resolve it against the current env before merging the test-only options in.
export default defineConfig(async (env) =>
  mergeConfig(
    await viteConfig(env),
    defineConfig({
      test: {
        environment: 'jsdom',
        setupFiles: ['./vitest.setup.js'],
        exclude: [...configDefaults.exclude, 'e2e/**'],
        root: fileURLToPath(new URL('./', import.meta.url)),
      },
    }),
  ),
)
