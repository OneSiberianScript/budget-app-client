<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed } from 'vue'

import { TheButton, TheInputNumber, TheSelect } from '@/shared/ui'

import { planItemFormSchema } from '../model/PlanItemForm.schema'
import { planItemFormInitialValues } from '../model/PlanItemForm.types'

import type { PlanItemFormValues } from '../model/PlanItemForm.types'

interface Props {
    categoryOptions: { label: string; value: string }[]
    initialValues?: Partial<PlanItemFormValues>
}

const props = withDefaults(defineProps<Props>(), { initialValues: undefined })

const { handleSubmit, isSubmitting, resetForm } = useForm<PlanItemFormValues>({
    validationSchema: toTypedSchema(planItemFormSchema),
    initialValues: { ...planItemFormInitialValues, ...props.initialValues }
})

const canSubmit = computed(() => !isSubmitting.value)

const emit = defineEmits<{ submit: [values: PlanItemFormValues] }>()

function onSubmit(values: PlanItemFormValues) {
    emit('submit', values)
}

defineExpose({ submit: handleSubmit, resetForm })
</script>

<template>
    <form
        class="plan-item-form"
        @submit.prevent="handleSubmit(onSubmit)"
    >
        <TheSelect
            name="categoryId"
            label="Категория"
            placeholder="Выберите категорию"
            :options="categoryOptions"
        />
        <TheInputNumber
            name="limitRub"
            label="Лимит (руб)"
            :min="0"
            :precision="2"
        />
        <TheButton
            type="primary"
            html-type="submit"
            :loading="isSubmitting"
            :disabled="!canSubmit"
        >
            Сохранить
        </TheButton>
    </form>
</template>

<style scoped>
.plan-item-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>
