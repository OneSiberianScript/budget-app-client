<script setup lang="ts">
import { Divider } from 'ant-design-vue'

/**
 * Обёртка над a-divider. Корневой класс: the-divider.
 */
interface Props {
    /** Направление линии: горизонтальная или вертикальная */
    type?: 'horizontal' | 'vertical'
    /** Пунктирная линия */
    dashed?: boolean
    /** Выравнивание текста в линии: по центру, слева или справа */
    orientation?: 'left' | 'right' | 'center'
    /** Без отступов у текста в линии */
    plain?: boolean
    /** Отступ текста от краёв (px или строка, например "1em") */
    orientationMargin?: string | number
}

withDefaults(defineProps<Props>(), {
    type: 'horizontal',
    dashed: false,
    orientation: 'center',
    plain: false,
    orientationMargin: undefined
})
</script>

<template>
    <Divider
        class="the-divider"
        :type="type"
        :dashed="dashed"
        :orientation="orientation"
        :plain="plain"
        :orientation-margin="orientationMargin"
        v-bind="$attrs"
    >
        <slot />
    </Divider>
</template>
