<script setup lang="ts">
import { Form } from 'ant-design-vue'

/**
 * Обёртка над a-form. Использовать с VeeValidate useForm; валидация на полях (TheInput, TheSelect и т.д.).
 * Корневой класс: the-form.
 */
interface Props {
    /** Расположение полей */
    layout?: 'horizontal' | 'vertical' | 'inline'
    /** Выравнивание подписей */
    labelAlign?: 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
    layout: 'vertical',
    labelAlign: 'left'
})
</script>

<template>
    <Form
        class="the-form"
        :layout="props.layout"
        :label-align="props.labelAlign"
        v-bind="$attrs"
    >
        <slot />
    </Form>
</template>
