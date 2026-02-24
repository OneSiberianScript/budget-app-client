<script setup lang="ts">
import { Form } from 'ant-design-vue'

/**
 * Обёртка над Form (Ant Design Vue). Использовать с VeeValidate useForm; валидация на полях (TheInput, TheSelect и т.д.).
 * При сабмите предотвращает отправку по умолчанию и эмитит submit — подключать @submit="handleSubmit(onSubmit)" (или formSubmitHandler).
 * Нативный submit формы может не срабатывать (напр. в Drawer/Modal), поэтому в формах дополнительно вешают обработчик на клик по кнопке и keydown.enter по обёртке — см. AccountForm.vue.
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

const emit = defineEmits<{
    /** Событие сабмита формы (вызывать handleSubmit из VeeValidate) */
    submit: [event: SubmitEvent]
}>()

function onFormSubmit(event: Event) {
    event.preventDefault()
    emit('submit', event as SubmitEvent)
}
</script>

<template>
    <Form
        class="the-form"
        :layout="props.layout"
        :label-align="props.labelAlign"
        v-bind="$attrs"
        @submit="onFormSubmit"
    >
        <slot />
    </Form>
</template>
