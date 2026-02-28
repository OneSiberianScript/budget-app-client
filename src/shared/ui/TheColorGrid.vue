<script setup lang="ts">
import { Form } from 'ant-design-vue'
import { useField } from 'vee-validate'

/** Опция для выбора цвета: метка и hex-значение. */
export interface ColorOption {
    label: string
    value: string
}

/**
 * Сетка выбора цвета с интеграцией VeeValidate.
 * Рендерит круглые цветные свотчи; по клику устанавливает значение поля.
 * Поддерживает null (нет выбора) — повторный клик по выбранному цвету снимает выбор.
 * Цвета из `disabledValues` отображаются с полосатым оверлеем и недоступны для выбора.
 * Корневой класс: the-color-grid.
 */
const props = withDefaults(
    defineProps<{
        /** Имя поля для VeeValidate (ключ в схеме формы) */
        name: string
        /** Подпись над сеткой */
        label?: string
        /** Список цветов */
        options: ColorOption[]
        /** Hex-значения цветов, недоступных для выбора (уже используются другими категориями) */
        disabledValues?: string[]
    }>(),
    { label: '', disabledValues: () => [] }
)

const { value, errorMessage } = useField<string | null | undefined>(() => props.name)

function select(val: string) {
    if (props.disabledValues.includes(val)) return
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
            class="the-color-grid"
            role="group"
            :aria-label="label"
        >
            <button
                v-for="opt in options"
                :key="opt.value"
                type="button"
                class="the-color-grid__item"
                :class="{
                    'the-color-grid__item--selected': value === opt.value,
                    'the-color-grid__item--disabled': disabledValues.includes(opt.value)
                }"
                :style="{ backgroundColor: opt.value }"
                :disabled="disabledValues.includes(opt.value)"
                :aria-label="opt.label"
                :aria-pressed="value === opt.value"
                :aria-disabled="disabledValues.includes(opt.value)"
                :title="disabledValues.includes(opt.value) ? 'Уже используется' : opt.label"
                @click="select(opt.value)"
            />
        </div>
    </Form.Item>
</template>

<style scoped>
.the-color-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(32px, 1fr));
    gap: 8px;
}

.the-color-grid__item {
    position: relative;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid transparent;
    cursor: pointer;
    padding: 0;
    transition:
        border-color 0.15s,
        transform 0.15s,
        box-shadow 0.15s;
    outline: none;
    flex-shrink: 0;
}

.the-color-grid__item:hover:not(.the-color-grid__item--disabled) {
    transform: scale(1.15);
}

.the-color-grid__item:focus-visible {
    box-shadow: 0 0 0 3px var(--color-primary);
}

.the-color-grid__item--selected {
    border-color: var(--color-text);
    box-shadow:
        0 0 0 2px var(--color-bg-container),
        0 0 0 4px var(--color-text);
    transform: scale(1.1);
}

.the-color-grid__item--disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.the-color-grid__item--disabled::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 3px,
        rgba(0, 0, 0, 0.3) 3px,
        rgba(0, 0, 0, 0.3) 4.5px
    );
}
</style>
