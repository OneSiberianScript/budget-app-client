<script setup lang="ts">
import { PageHeader } from 'ant-design-vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/**
 * Обёртка над a-page-header. Корневой класс: the-page-header.
 * Кнопка «Назад» показывается, если передан showBack или в meta маршрута указан parent.
 * По клику: переход на маршрут из meta.parent либо эмит back (если передан @back).
 */
interface Props {
    /** Заголовок страницы */
    title?: string
    /** Подзаголовок */
    subTitle?: string
    /** Показывать кнопку «Назад» (по умолчанию из route.meta.parent) */
    showBack?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    title: '',
    subTitle: '',
    showBack: undefined
})

const route = useRoute()
const router = useRouter()

const showBackComputed = computed(() => {
    if (props.showBack !== undefined) return props.showBack
    return !!(route.meta.parent as string | undefined)
})

// Обработчик @back передаём через v-on="backListeners", а не через @back="handleBack",
// чтобы при showBackComputed === false вообще не вешать слушатель: тогда дочерний компонент
// не получает callback и не считает, что кнопка «Назад» должна что-то вызывать и, соответственно, не отображается.
const backListeners = computed(() => (showBackComputed.value ? { back: handleBack } : {}))

const emit = defineEmits<{
    back: []
}>()

function handleBack() {
    const parentName = route.meta.parent as string | undefined
    if (parentName) {
        router.push({ name: parentName })
    }
    emit('back')
}
</script>

<template>
    <PageHeader
        class="the-page-header"
        :title="title"
        :sub-title="subTitle"
        v-bind="$attrs"
        v-on="backListeners"
    >
        <template
            v-if="$slots.extra"
            #extra
        >
            <slot name="extra" />
        </template>
        <template
            v-if="$slots.footer"
            #footer
        >
            <slot name="footer" />
        </template>
        <template
            v-if="$slots.breadcrumb"
            #breadcrumb
        >
            <slot name="breadcrumb" />
        </template>
        <slot />
    </PageHeader>
</template>
