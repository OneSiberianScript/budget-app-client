import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            environment: 'jsdom',
            globals: true,
            setupFiles: ['./test/setup.ts'],
            coverage: {
                provider: 'v8',
                reporter: ['text', 'html', 'lcov'],
                reportsDirectory: './test/coverage',
                exclude: ['node_modules/**', 'test/**', '**/*.spec.ts', '**/*.config.*', 'dist/**']
            },
            include: ['src/**/*.spec.ts'],
            exclude: ['node_modules', 'dist', 'test/e2e']
        }
    })
)
