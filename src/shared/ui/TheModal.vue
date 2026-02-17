<script setup lang="ts">
import { Modal } from 'ant-design-vue'
import { computed, useSlots } from 'vue'

type Preset = 'confirm' | 'dialog' | 'card'
type Size = 'small' | 'medium' | 'large' | 'huge'
type ModalType = 'default' | 'info' | 'warning' | 'error' | 'success'

interface Props {
    /** Открыт/закрыт (v-model) */
    modelValue: boolean
    /** Заголовок */
    title?: string
    /** Текст в теле при preset="confirm" */
    content?: string
    /** Размер (ширина) */
    size?: Size
    /** Пресет: confirm (да/нет), dialog (слот по умолчанию), card */
    preset?: Preset
    /** Подпись кнопки подтверждения (preset confirm) */
    positiveText?: string
    /** Подпись кнопки отмены (preset confirm) */
    negativeText?: string
    /** Семантический тип (иконка, акцент) */
    type?: ModalType
    /** Закрывать по клику по маске */
    maskClosable?: boolean
    /** Показывать кнопку закрытия (x) */
    closable?: boolean
    /** Состояние загрузки на кнопке подтверждения (preset confirm) */
    loading?: boolean
    /** Показывать иконку типа в заголовке */
    showIcon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    title: '',
    content: '',
    size: 'medium',
    preset: 'dialog',
    positiveText: 'Подтвердить',
    negativeText: 'Отмена',
    type: 'default',
    maskClosable: true,
    closable: true,
    loading: false,
    showIcon: true
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    positiveClick: []
    negativeClick: []
    close: []
}>()

const widthMap: Record<Size, number> = {
    small: 400,
    medium: 520,
    large: 720,
    huge: 960
}

const open = computed({
    get: () => props.modelValue,
    set: (v) => emit('update:modelValue', v)
})

const modalWidth = computed(() => widthMap[props.size])

const slots = useSlots()
const isConfirmPreset = computed(() => props.preset === 'confirm')

/** Hide default footer for dialog/card when no footer slot. */
const footer = computed(() => {
    if (props.preset === 'confirm') return undefined
    return slots.footer ? undefined : null
})

function onOk() {
    if (isConfirmPreset.value) {
        emit('positiveClick')
    }
}

function onCancel() {
    if (isConfirmPreset.value) {
        emit('negativeClick')
    }
    open.value = false
    emit('close')
}
</script>

<template>
    <Modal
        v-model:open="open"
        class="the-modal"
        :title="title"
        :width="modalWidth"
        :closable="closable"
        :mask-closable="maskClosable"
        :ok-text="isConfirmPreset ? positiveText : undefined"
        :cancel-text="isConfirmPreset ? negativeText : undefined"
        :ok-type="isConfirmPreset ? (type === 'error' ? 'danger' : 'primary') : undefined"
        :confirm-loading="loading"
        :footer="footer"
        @ok="onOk"
        @cancel="onCancel"
    >
        <template
            v-if="preset === 'confirm'"
            #default
        >
            {{ content }}
        </template>
        <template
            v-else
            #default
        >
            <slot />
        </template>
        <template
            v-if="$slots.footer"
            #footer
        >
            <slot name="footer" />
        </template>
    </Modal>
</template>
