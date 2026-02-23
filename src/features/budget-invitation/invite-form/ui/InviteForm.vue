<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed } from 'vue'

import { TheButton, TheInput, TheSelect } from '@/shared/ui'

import { inviteFormSchema } from '../model/InviteForm.schema'
import { inviteFormInitialValues } from '../model/InviteForm.types'

import type { InviteFormValues } from '../model/InviteForm.types'

const props = withDefaults(defineProps<{ initialValues?: Partial<InviteFormValues> }>(), { initialValues: undefined })

const { handleSubmit, isSubmitting, resetForm } = useForm<InviteFormValues>({
    validationSchema: toTypedSchema(inviteFormSchema),
    initialValues: { ...inviteFormInitialValues, ...props.initialValues }
})

const canSubmit = computed(() => !isSubmitting.value)

const roleOptions = [
    { label: 'Наблюдатель', value: 'viewer' },
    { label: 'Редактор', value: 'editor' }
]

const emit = defineEmits<{ submit: [values: InviteFormValues] }>()

function onSubmit(values: InviteFormValues) {
    emit('submit', values)
}

defineExpose({ submit: handleSubmit, resetForm })
</script>

<template>
    <form
        class="invite-form"
        @submit.prevent="handleSubmit(onSubmit)"
    >
        <TheInput
            name="email"
            label="Email приглашаемого"
            type="email"
            placeholder="user@example.com"
        />
        <TheSelect
            name="role"
            label="Роль в бюджете"
            placeholder="Выберите роль"
            :options="roleOptions"
        />
        <TheButton
            type="primary"
            html-type="submit"
            :loading="isSubmitting"
            :disabled="!canSubmit"
        >
            Пригласить
        </TheButton>
    </form>
</template>

<style scoped>
.invite-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>
