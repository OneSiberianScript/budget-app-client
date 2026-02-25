<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue'
import { Button } from 'ant-design-vue'

/**
 * Кнопка «Создать»/«Добавить»/«Пригласить».
 * На viewport < 768px показывается только иконка плюса, на 768px+ — только текст (label).
 * Используется в шапках страниц и формах приглашения.
 */
interface Props {
    /** Подпись кнопки (видна на десктопе) и значение aria-label при показе только иконки */
    label: string
}

defineOptions({ inheritAttrs: false })

withDefaults(defineProps<Props>(), {})
</script>

<template>
    <Button
        class="the-create-button"
        type="primary"
        :aria-label="label"
        v-bind="$attrs"
    >
        <span
            class="the-create-button__icon"
            aria-hidden="true"
        >
            <PlusOutlined />
        </span>
        <span class="the-create-button__text">{{ label }}</span>
    </Button>
</template>

<style scoped>
.the-create-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.the-create-button__text {
    display: none;
}

.the-create-button__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

@media (min-width: 768px) {
    .the-create-button__icon {
        display: none;
    }

    .the-create-button__text {
        display: inline;
    }
}
</style>
