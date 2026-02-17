import { mount, type VueWrapper } from '@vue/test-utils'
import Antd from 'ant-design-vue'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'

import routes from '@/app/providers/router/routes'

import type { Component } from 'vue'

export interface MountWithProvidersOptions {
    /** Начальный путь роутера */
    route?: string
    /** Заглушить глобальные действия (по умолчанию true) */
    stubActions?: boolean
}

/**
 * Монтирует компонент с провайдерами: Pinia, Vue Router, Ant Design Vue.
 * Используется для component-тестов с формами и навигацией.
 * @param component - Vue-компонент для монтирования
 * @param options.route - Начальный путь роутера (по умолчанию '/')
 * @param options.stubActions - Заглушить teleport (по умолчанию true)
 * @returns Обёртка @vue/test-utils
 */
export function mountWithProviders(component: Component, options: MountWithProvidersOptions = {}): VueWrapper {
    const { route = '/', stubActions = true } = options

    const pinia = createPinia()
    const router = createRouter({
        history: createMemoryHistory(),
        routes
    })

    router.push(route)

    return mount(component, {
        global: {
            plugins: [pinia, router, Antd],
            stubs: stubActions ? { teleport: true } : undefined
        }
    })
}
