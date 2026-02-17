import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { visualizer } from 'rollup-plugin-visualizer';
import { fileURLToPath, URL } from 'node:url';
export default defineConfig({
    plugins: [
        vue(),
        process.env.NODE_ENV === 'analyze'
            ? visualizer({ open: true, gzipSize: true, filename: 'dist/stats.html' })
            : []
    ].filter(Boolean),
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
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
});
