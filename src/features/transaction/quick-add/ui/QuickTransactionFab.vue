<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useMediaQuery } from '@vueuse/core'
import { useForm, useField } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import { z } from 'zod'

import { useAccountStore } from '@/entities/account'
import { useBudgetStore } from '@/entities/budget'
import { useCategoryStore } from '@/entities/category'
import { useSessionStore } from '@/entities/session'
import { useTransactionStore } from '@/entities/transaction'
import type { Transaction } from '@/entities/transaction'
import { createTransaction } from '@/entities/transaction/api'

import { message } from '@/shared/lib/message'
import { TheButton, TheDrawer, TheForm, TheInputNumber, TheSelect } from '@/shared/ui'

type TransactionType = 'expense' | 'income'

const quickSchema = z.object({
    accountId: z.string().min(1, 'Выберите счёт'),
    categoryId: z.string().optional(),
    amount: z.number({ invalid_type_error: 'Введите сумму' }).positive('Сумма должна быть больше 0')
})

const budgetStore = useBudgetStore()
const accountStore = useAccountStore()
const categoryStore = useCategoryStore()
const sessionStore = useSessionStore()
const transactionStore = useTransactionStore()

/** FAB скрывается на десктопе (≥1024px). */
const isDesktopOrWider = useMediaQuery('(min-width: 1024px)')

const drawerOpen = ref(false)
const activeType = ref<TransactionType>('expense')
const isAccountsLoading = ref(false)

const { handleSubmit, resetForm, isSubmitting } = useForm({
    validationSchema: toTypedSchema(quickSchema)
})

const { value: accountId } = useField<string>('accountId')
const { value: categoryId } = useField<string | undefined>('categoryId')

const accountOptions = computed(() =>
    (Array.isArray(accountStore.accounts) ? accountStore.accounts : []).map((a) => ({
        label: a.name,
        value: a.id
    }))
)

const categoryOptions = computed(() => {
    const type = activeType.value === 'expense' ? 'expense' : 'income'
    return (Array.isArray(categoryStore.categories) ? categoryStore.categories : [])
        .filter((c) => c.type === type)
        .map((c) => ({ label: c.name, value: c.id }))
})

const drawerTitle = computed(() => (activeType.value === 'expense' ? 'Добавить расход' : 'Добавить доход'))

const accountLabel = computed(() => (activeType.value === 'expense' ? 'Счёт списания' : 'Счёт зачисления'))

async function loadAccountsIfNeeded() {
    const budgetId = budgetStore.currentBudgetId
    if (!budgetId || accountStore.accounts?.length) return
    isAccountsLoading.value = true
    try {
        await accountStore.fetchAccounts(budgetId)
    } finally {
        isAccountsLoading.value = false
    }
}

function openDrawer(type: TransactionType) {
    activeType.value = type
    resetForm()
    drawerOpen.value = true
    loadAccountsIfNeeded()
}

// При смене типа сбрасываем поля (счёт и категория зависят от типа)
watch(activeType, () => {
    accountId.value = ''
    categoryId.value = undefined
})

const onSubmit = handleSubmit(async (values) => {
    const budgetId = budgetStore.currentBudgetId
    const userId = sessionStore.user?.id
    if (!budgetId || !userId) return

    const today = new Date().toISOString().slice(0, 10)
    const isExpense = activeType.value === 'expense'

    try {
        const created = await createTransaction({
            type: activeType.value,
            budgetId,
            debitAccountId: isExpense ? values.accountId : null,
            creditAccountId: isExpense ? null : values.accountId,
            categoryId: values.categoryId || null,
            amount: String(values.amount),
            occurredAt: today,
            description: null,
            createdById: userId
        })
        transactionStore.setTransaction(created as Transaction)
        message.success(isExpense ? 'Расход добавлен' : 'Доход добавлен')
        drawerOpen.value = false
    } catch {
        message.error('Ошибка сохранения')
    }
})
</script>

<template>
    <template v-if="!isDesktopOrWider">
        <!-- FAB кнопки -->
        <div class="quick-fab">
            <button
                class="quick-fab__btn quick-fab__btn--expense"
                type="button"
                aria-label="Добавить расход"
                @click="openDrawer('expense')"
            >
                −
            </button>
            <button
                class="quick-fab__btn quick-fab__btn--income"
                type="button"
                aria-label="Добавить доход"
                @click="openDrawer('income')"
            >
                +
            </button>
        </div>

        <!-- Drawer с формой -->
        <TheDrawer
            v-model:open="drawerOpen"
            :title="drawerTitle"
        >
            <TheForm
                class="quick-fab__form"
                @submit.prevent="onSubmit"
            >
                <TheSelect
                    name="accountId"
                    :label="accountLabel"
                    placeholder="Выберите счёт"
                    :options="accountOptions"
                    :disabled="isAccountsLoading"
                />
                <TheSelect
                    name="categoryId"
                    label="Категория"
                    placeholder="Необязательно"
                    :options="categoryOptions"
                />
                <TheInputNumber
                    name="amount"
                    label="Сумма"
                    :precision="2"
                />
                <TheButton
                    type="primary"
                    html-type="submit"
                    :loading="isSubmitting"
                    @click.prevent="onSubmit"
                >
                    Сохранить
                </TheButton>
            </TheForm>
        </TheDrawer>
    </template>
</template>

<style scoped>
.quick-fab {
    position: fixed;
    right: 16px;
    bottom: calc(72px + env(safe-area-inset-bottom) + 16px);
    z-index: 90;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.quick-fab__btn {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: none;
    font-size: 1.75rem;
    line-height: 1;
    font-weight: 400;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transition:
        transform 0.15s,
        box-shadow 0.15s;
    color: #fff;
}

.quick-fab__btn:hover {
    transform: scale(1.08);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.28);
}

.quick-fab__btn:active {
    transform: scale(0.96);
}

.quick-fab__btn--expense {
    background: var(--color-semantic-error, #f5222d);
}

.quick-fab__btn--income {
    background: var(--color-semantic-success, #52c41a);
}

.quick-fab__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

/* На планшетах (768px–1023px) FAB прижат к низу без поправки на нижнее меню */
@media (min-width: 768px) {
    .quick-fab {
        bottom: 24px;
    }
}
</style>
