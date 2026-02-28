<script setup lang="ts">
import { Form } from 'ant-design-vue'
import { useField } from 'vee-validate'

/** Опция для выбора иконки: метка и строковый ключ. */
export interface IconOption {
    label: string
    value: string
}

/**
 * Сетка выбора иконки с интеграцией VeeValidate.
 * Рендерит кнопки-плитки; содержимое каждой кнопки передаётся через слот #option.
 * Поддерживает null (нет выбора) — повторный клик по выбранной иконке снимает выбор.
 * Корневой класс: the-icon-grid.
 */
const props = withDefaults(
    defineProps<{
        /** Имя поля для VeeValidate (ключ в схеме формы) */
        name: string
        /** Подпись над сеткой */
        label?: string
        /** Список иконок */
        options: IconOption[]
    }>(),
    { label: '' }
)

defineSlots<{
    /**
     * Кастомный рендер содержимого кнопки.
     * @param option — текущая опция
     * @param isSelected — выбрана ли эта опция
     */
    option?: (props: { option: IconOption; isSelected: boolean }) => unknown
}>()

const { value, errorMessage } = useField<string | null | undefined>(() => props.name)

function select(val: string) {
    value.value = value.value === val ? null : val
}
</script>

<template>
    <Form.Item
        :label="label"
        :validate-status="errorMessage ? 'error' : undefined"
        :help="errorMessage"
    >
        <div
            class="the-icon-grid"
            role="group"
            :aria-label="label"
        >
            <button
                v-for="opt in options"
                :key="opt.value"
                type="button"
                class="the-icon-grid__item"
                :class="{ 'the-icon-grid__item--selected': value === opt.value }"
                :aria-label="opt.label"
                :aria-pressed="value === opt.value"
                :title="opt.label"
                @click="select(opt.value)"
            >
                <slot
                    name="option"
                    :option="opt"
                    :is-selected="value === opt.value"
                >
                    <span>{{ opt.label }}</span>
                </slot>
            </button>
        </div>
    </Form.Item>
</template>

<style scoped>
.the-icon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
    gap: 8px;
}

.the-icon-grid__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    width: 100%;
    aspect-ratio: 1;
    min-width: 48px;
    border-radius: 8px;
    border: 1.5px solid var(--color-border);
    background: var(--color-bg-container);
    cursor: pointer;
    padding: 6px 4px;
    font-size: 0.625rem;
    color: var(--color-text-secondary);
    transition:
        border-color 0.15s,
        background 0.15s,
        color 0.15s;
    outline: none;
}

.the-icon-grid__item:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
}

.the-icon-grid__item:focus-visible {
    box-shadow: 0 0 0 2px var(--color-primary);
}

.the-icon-grid__item--selected {
    border-color: var(--color-primary);
    background: var(--color-primary-bg);
    color: var(--color-primary);
}
</style>
