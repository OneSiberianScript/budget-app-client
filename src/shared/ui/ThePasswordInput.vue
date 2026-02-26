<script setup lang="ts">
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons-vue'
import { Form, Input } from 'ant-design-vue'
import { useField } from 'vee-validate'
import { ref, computed } from 'vue'

/**
 * Поле ввода пароля с кнопкой «показать/скрыть» (иконка глаза).
 * API совместим с TheInput для подстановки в формах (VeeValidate по name).
 */
type Props = {
    /** Имя поля для VeeValidate (должно совпадать с ключом в схеме формы) */
    name: string
    /** Подпись над полем; используется для aria-label (E2E getByLabel) */
    label?: string
    /** Placeholder в пустом поле */
    placeholder?: string
    /** Атрибут autocomplete (например new-password, current-password) */
    autocomplete?: string
    /** Неактивно */
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    label: '',
    placeholder: undefined,
    autocomplete: undefined,
    disabled: false
})

const { value, errorMessage } = useField<string>(() => props.name)

const visible = ref(false)

const toggleAriaLabel = computed(() => (visible.value ? 'Скрыть пароль' : 'Показать пароль'))

function toggleVisible() {
    visible.value = !visible.value
}
</script>

<template>
    <Form.Item
        :label="label"
        :validate-status="errorMessage ? 'error' : undefined"
        :help="errorMessage"
    >
        <Input
            :id="name"
            v-model:value="value"
            class="the-password-input"
            :placeholder="placeholder"
            :type="visible ? 'text' : 'password'"
            :autocomplete="autocomplete"
            :disabled="disabled"
            :aria-label="label || name"
        >
            <template #suffix>
                <button
                    type="button"
                    class="the-password-input__toggle"
                    :aria-label="toggleAriaLabel"
                    @click="toggleVisible"
                >
                    <EyeOutlined
                        v-if="!visible"
                        aria-hidden="true"
                    />
                    <EyeInvisibleOutlined
                        v-else
                        aria-hidden="true"
                    />
                </button>
            </template>
        </Input>
    </Form.Item>
</template>

<style scoped>
.the-password-input__toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    padding: 0;
    margin: 0 -4px 0 0;
    border: none;
    background: transparent;
    color: inherit;
    cursor: pointer;
    border-radius: 0;
}

.the-password-input__toggle:hover {
    color: var(--ant-color-primary);
}

.the-password-input__toggle:focus-visible {
    outline: 2px solid var(--ant-color-primary);
    outline-offset: 2px;
}
</style>
