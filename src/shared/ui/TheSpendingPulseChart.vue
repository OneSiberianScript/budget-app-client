<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'

import type { Transaction } from '@/entities/transaction'

import { useTheme } from '@/shared/config/theme/useTheme'
import { getMonthRange } from '@/shared/lib/date'
import { formatMoneyFromCents } from '@/shared/lib/format-money'

/**
 * Pulse chart — area-линия трат/доходов по дням месяца.
 * Позволяет видеть динамику расходов за выбранный период.
 * Используется на странице транзакций над таблицей.
 */
interface Props {
    /** Транзакции для агрегации (уже отфильтрованные по бюджету). */
    transactions: Transaction[]
    /** Месяц YYYY-MM для формирования оси X (все дни месяца). */
    month: string
    /** Тип транзакций для отображения. По умолчанию — все. */
    type?: 'expense' | 'income' | 'all'
    /** Фильтр по categoryId (пустой массив = все категории). */
    categoryIds?: string[]
}

const props = withDefaults(defineProps<Props>(), {
    type: 'all',
    categoryIds: () => []
})

const { currentTheme } = useTheme()

const isDark = computed(() => currentTheme.value === 'dark')

/** Дни месяца: { date: 'YYYY-MM-DD', label: 'Д' }[] */
const monthDays = computed(() => {
    const { from, to } = getMonthRange(props.month)
    const days: Array<{ date: string; label: string }> = []
    let current = new Date(from + 'T00:00:00')
    const end = new Date(to + 'T00:00:00')
    while (current <= end) {
        const y = current.getFullYear()
        const m = String(current.getMonth() + 1).padStart(2, '0')
        const d = String(current.getDate()).padStart(2, '0')
        days.push({ date: `${y}-${m}-${d}`, label: String(current.getDate()) })
        current = new Date(current.getTime() + 86_400_000)
    }
    return days
})

/** Суммы по дням в копейках. */
const sumsByDay = computed((): Record<string, number> => {
    const filterIds = new Set(props.categoryIds)
    const out: Record<string, number> = {}
    for (const day of monthDays.value) out[day.date] = 0
    for (const t of props.transactions) {
        if (props.type !== 'all' && t.type !== props.type) continue
        if (filterIds.size > 0 && t.categoryId && !filterIds.has(t.categoryId)) continue
        const day = t.occurredAt.slice(0, 10)
        if (!(day in out)) continue
        const cents = Math.round((parseFloat(t.amount) || 0) * 100)
        out[day] = (out[day] ?? 0) + cents
    }
    return out
})

const todayDate = new Date().toISOString().slice(0, 10)

const chartOption = computed(() => {
    const labels = monthDays.value.map((d) => d.label)
    const values = monthDays.value.map((d) => sumsByDay.value[d.date] ?? 0)
    const todayIndex = monthDays.value.findIndex((d) => d.date === todayDate)

    const accentColor = '#f5b72b'
    const textColor = isDark.value ? '#d6d3cf' : '#5f5c58'
    const gridColor = isDark.value ? '#4e4a47' : '#e8e8e8'

    return {
        grid: { top: 8, right: 8, bottom: 24, left: 56, containLabel: false },
        tooltip: {
            trigger: 'axis',
            formatter: (params: Array<{ dataIndex: number; value: number }>) => {
                const p = params[0]
                const day = monthDays.value[p.dataIndex]
                return `${day.date}: ${formatMoneyFromCents(p.value)}`
            }
        },
        xAxis: {
            type: 'category',
            data: labels,
            axisLine: { lineStyle: { color: gridColor } },
            axisTick: { show: false },
            axisLabel: {
                color: textColor,
                fontSize: 11,
                interval: Math.floor(monthDays.value.length / 6)
            },
            splitLine: { show: false }
        },
        yAxis: {
            type: 'value',
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
                color: textColor,
                fontSize: 11,
                formatter: (v: number) => formatMoneyFromCents(v)
            },
            splitLine: { lineStyle: { color: gridColor, type: 'dashed' } }
        },
        series: [
            {
                type: 'line',
                data: values,
                smooth: 0.4,
                symbol: 'circle',
                symbolSize: 4,
                showSymbol: false,
                emphasis: { scale: true },
                lineStyle: { color: accentColor, width: 2 },
                itemStyle: { color: accentColor },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: isDark.value ? 'rgba(245,183,43,0.25)' : 'rgba(245,183,43,0.2)' },
                            { offset: 1, color: 'rgba(245,183,43,0)' }
                        ]
                    }
                },
                markLine:
                    todayIndex >= 0
                        ? {
                              silent: true,
                              symbol: ['none', 'none'],
                              data: [{ xAxis: todayIndex }],
                              lineStyle: { color: textColor, type: 'dashed', width: 1, opacity: 0.5 }
                          }
                        : undefined
            }
        ]
    }
})
</script>

<template>
    <div class="the-spending-pulse-chart">
        <VChart
            :option="chartOption"
            autoresize
            class="the-spending-pulse-chart__chart"
        />
    </div>
</template>

<style scoped>
.the-spending-pulse-chart {
    width: 100%;
    height: 160px;
}

.the-spending-pulse-chart__chart {
    width: 100%;
    height: 100%;
}

@media (min-width: 768px) {
    .the-spending-pulse-chart {
        height: 200px;
    }
}
</style>
