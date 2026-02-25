<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed } from 'vue'

import { TheCreateButton, TheForm, TheInput, TheSelect } from '@/shared/ui'

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

function formSubmitHandler(e: SubmitEvent) {
    handleSubmit(onSubmit)(e)
}

defineExpose({ submit: handleSubmit, resetForm })
</script>

<template>
    <div
        class="invite-form"
        @keydown.enter.prevent="formSubmitHandler($event as unknown as SubmitEvent)"
    >
        <TheForm
            class="invite-form__form"
            @submit="formSubmitHandler"
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
            <TheCreateButton
                label="Пригласить"
                type="primary"
                html-type="submit"
                :loading="isSubmitting"
                :disabled="!canSubmit"
                @click.prevent="formSubmitHandler($event as unknown as SubmitEvent)"
            />
        </TheForm>
    </div>
</template>

<style scoped>
.invite-form,
.invite-form__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>
