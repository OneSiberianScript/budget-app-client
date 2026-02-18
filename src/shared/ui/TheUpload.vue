<script setup lang="ts">
import { Form, Upload } from 'ant-design-vue'
import { useField } from 'vee-validate'

import type { UploadFile } from 'ant-design-vue/es/upload/interface'

/**
 * Обёртка над a-upload с интеграцией VeeValidate. Корневой класс: the-upload.
 * Значение поля формы — fileList (массив файлов).
 */
interface Props {
    /** Имя поля для VeeValidate (должно совпадать с ключом в схеме формы) */
    name: string
    /** Подпись над полем; используется для aria-label (E2E getByLabel) */
    label?: string
    /** URL или функция для загрузки файла */
    action?: string | ((file: File) => string) | ((file: File) => Promise<string>)
    /** Несколько файлов */
    multiple?: boolean
    /** Принимаемые типы файлов (accept) */
    accept?: string
    /** Неактивно */
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    label: '',
    action: '',
    multiple: false,
    accept: undefined,
    disabled: false
})

const { value: fileList, errorMessage } = useField<UploadFile[] | undefined>(() => props.name)
</script>

<template>
    <Form.Item
        :label="label"
        :validate-status="errorMessage ? 'error' : undefined"
        :help="errorMessage"
    >
        <Upload
            :id="name"
            v-model:file-list="fileList"
            class="the-upload"
            :action="action"
            :multiple="multiple"
            :accept="accept"
            :disabled="disabled"
            :aria-label="label || name"
            v-bind="$attrs"
        >
            <slot />
        </Upload>
    </Form.Item>
</template>
