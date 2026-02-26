<script setup lang="ts">
import { computed, onMounted } from 'vue'

import { useBudgetStore } from '@/entities/budget'

const budgetStore = useBudgetStore()

const options = computed(() => budgetStore.budgets.map((b) => ({ label: b.name, value: b.id })))

const currentValue = computed({
    get: () => budgetStore.currentBudgetId ?? undefined,
    set: (id: string | undefined) => {
        budgetStore.setCurrentBudget(id ?? null, null)
    }
})

onMounted(() => {
    if (budgetStore.budgets.length === 0) {
        budgetStore.ensureBudgetsLoaded()
    }
})
</script>

<template>
    <div class="budget-switcher">
        <a-select
            v-if="options.length > 0"
            v-model:value="currentValue"
            class="budget-switcher__select"
            :options="options"
            placeholder="Выберите бюджет"
            allow-clear
            style="min-width: 160px"
        />
        <span
            v-else
            class="budget-switcher__empty"
            >Нет бюджетов</span
        >
    </div>
</template>

<style scoped>
.budget-switcher__empty {
    color: var(--color-text-secondary);
    font-size: 14px;
}
</style>
