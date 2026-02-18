<script setup lang="ts">
import { Breadcrumb } from 'ant-design-vue'

/**
 * Обёртка над a-breadcrumb. Корневой класс: the-breadcrumb.
 */
interface BreadcrumbRoute {
    path: string
    breadcrumbName: string
    children?: BreadcrumbRoute[]
}

interface Props {
    /** Маршруты хлебных крошек (path, breadcrumbName) */
    routes?: BreadcrumbRoute[]
    /** Разделитель между элементами */
    separator?: string
}

withDefaults(defineProps<Props>(), {
    routes: () => [],
    separator: '/'
})
</script>

<template>
    <Breadcrumb
        class="the-breadcrumb"
        :routes="routes"
        :separator="separator"
        v-bind="$attrs"
    >
        <template
            v-if="$slots.default"
            #default
        >
            <slot />
        </template>
        <template
            v-if="$slots.separator"
            #separator
        >
            <slot name="separator" />
        </template>
    </Breadcrumb>
</template>
