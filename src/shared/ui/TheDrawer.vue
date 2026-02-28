<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { Drawer } from 'ant-design-vue'
import { computed } from 'vue'

import { MEDIA_MAX_WIDTH_MOBILE } from '@/shared/config/breakpoints'

/**
 * Обёртка над a-drawer. Корневой класс: the-drawer.
 * На viewport ≤ MEDIA_MAX_WIDTH_MOBILE панель выезжает снизу.
 */
interface Props {
    /** Видимость панели (v-model:open) */
    open: boolean
    /** Заголовок */
    title?: string
    /** С какой стороны выезжает панель (на десктопе; на мобильных всегда bottom) */
    placement?: 'top' | 'right' | 'bottom' | 'left'
    /** Ширина панели (для left/right); для bottom не используется */
    width?: number | string
    /** Высота панели при placement bottom (на мобильных) */
    height?: number | string
    /** Показывать кнопку закрытия */
    closable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    title: '',
    placement: 'right',
    width: 400,
    height: '60%',
    closable: true
})

const emit = defineEmits<{
    'update:open': [value: boolean]
}>()

const isMobile = useMediaQuery(`(max-width: ${MEDIA_MAX_WIDTH_MOBILE}px)`)

const effectivePlacement = computed(() => (isMobile.value ? 'bottom' : props.placement))

const drawerWidth = computed(() =>
    effectivePlacement.value === 'left' || effectivePlacement.value === 'right' ? props.width : undefined
)

const drawerHeight = computed(() =>
    effectivePlacement.value === 'top' || effectivePlacement.value === 'bottom' ? props.height : undefined
)
</script>

<template>
    <Drawer
        class="the-drawer"
        :open="open"
        :title="title"
        :placement="effectivePlacement"
        :width="drawerWidth"
        :height="drawerHeight"
        :closable="closable"
        v-bind="$attrs"
        @update:open="emit('update:open', $event)"
    >
        <slot />
    </Drawer>
</template>
