import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
    server: {
        port: 5173,
        proxy: {
            // Все запросы на /api идут на бэкенд; в браузере origin остаётся localhost:5173
            '/api': {
                target: 'https://kkors.ru',
                // target: 'http://localhost:3000',
                changeOrigin: true
            }
        }
    },
    plugins: [
        vue(),
        process.env.NODE_ENV === 'analyze'
            ? visualizer({ open: true, gzipSize: true, filename: 'dist/stats.html' })
            : []
    ].filter(Boolean),
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@test': fileURLToPath(new URL('./test', import.meta.url))
        }
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    echarts: ['echarts', 'vue-echarts'],
                    'vue-vendor': ['vue', 'vue-router', 'pinia'],
                    entities: []
                }
            }
        }
    }
})
