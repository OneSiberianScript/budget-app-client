import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { createHtmlPlugin } from 'vite-plugin-html'
import { visualizer } from 'rollup-plugin-visualizer'
import { fileURLToPath, URL } from 'node:url'

function buildPreconnectTag(apiBaseUrl: string | undefined): string {
    if (!apiBaseUrl || !/^https?:\/\//.test(apiBaseUrl)) return ''
    try {
        const origin = new URL(apiBaseUrl).origin
        return `<link rel="preconnect" href="${origin}" crossorigin />`
    } catch {
        return ''
    }
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    const preconnect = buildPreconnectTag(env.VITE_API_BASE_URL)

    return {
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
            createHtmlPlugin({
                minify: true,
                inject: { data: { preconnect } }
            }),
            VitePWA({
                registerType: 'autoUpdate',
                manifest: false,
                workbox: {
                    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,webmanifest}']
                }
            }),
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
    }
})
