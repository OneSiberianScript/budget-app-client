import { mountWithProviders } from '@test/utils'
import { describe, it, expect } from 'vitest'

import TheCategoryPlanLines from './TheCategoryPlanLines.vue'

import type { CategoryPlanLineItem } from './TheCategoryPlanLines.vue'

const items: CategoryPlanLineItem[] = [
    {
        id: 'cat-1',
        categoryId: 'cat-1',
        categoryName: 'Продукты',
        plannedCents: 10000,
        actualCents: 6000
    },
    {
        id: 'cat-2',
        categoryId: 'cat-2',
        categoryName: 'Транспорт',
        plannedCents: 5000,
        actualCents: 5000
    }
]

describe('TheCategoryPlanLines', () => {
    it('рендерит с корневым классом the-category-plan-lines', () => {
        const wrapper = mountWithProviders(TheCategoryPlanLines, { props: { items: [] } })
        expect(wrapper.find('.the-category-plan-lines').exists()).toBe(true)
    })

    it('рендерит линии по переданным items', () => {
        const wrapper = mountWithProviders(TheCategoryPlanLines, { props: { items } })
        const lines = wrapper.findAll('.the-category-plan-lines__line')
        expect(lines).toHaveLength(2)
        expect(lines[0].find('.the-category-plan-lines__name').text()).toBe('Продукты')
        expect(lines[1].find('.the-category-plan-lines__name').text()).toBe('Транспорт')
    })

    it('для типа expense отображает остаток как план минус факт (в рублях)', () => {
        const wrapper = mountWithProviders(TheCategoryPlanLines, {
            props: { items, type: 'expense' }
        })
        const remainders = wrapper.findAll('.the-category-plan-lines__remainder')
        // 10000 - 6000 = 4000 коп = 40 руб
        expect(remainders[0].text()).toContain('40')
        // 5000 - 5000 = 0
        expect(remainders[1].text()).toMatch(/0\s*₽|0[,.]00/)
    })

    it('для типа income отображает остаток (факт минус план, по модулю)', () => {
        const wrapper = mountWithProviders(TheCategoryPlanLines, {
            props: { items, type: 'income' }
        })
        const remainders = wrapper.findAll('.the-category-plan-lines__remainder')
        // actual - planned = 6000 - 10000 = -4000, показывается abs = 40 руб
        expect(remainders[0].text()).toContain('40')
    })

    it('заливка имеет ширину в процентах от выполнения плана', () => {
        const wrapper = mountWithProviders(TheCategoryPlanLines, {
            props: { items, type: 'expense' }
        })
        const fills = wrapper.findAll('.the-category-plan-lines__fill')
        expect(fills[0].attributes('style')).toContain('width: 60%') // 6000/10000*100
        expect(fills[1].attributes('style')).toContain('width: 100%') // 5000/5000
    })

    it('заливка использует цвет категории при переданном color', () => {
        const itemsWithColor: CategoryPlanLineItem[] = [{ ...items[0], color: '#ff0000' }]
        const wrapper = mountWithProviders(TheCategoryPlanLines, {
            props: { items: itemsWithColor }
        })
        const fill = wrapper.find('.the-category-plan-lines__fill')
        expect(fill.attributes('style')).toContain('background')
        expect(fill.attributes('style')).toMatch(/255,\s*0,\s*0|#ff0000/i)
    })

    it('при клике по строке эмитит clickLine с объектом строки', async () => {
        const wrapper = mountWithProviders(TheCategoryPlanLines, {
            props: { items }
        })
        const firstLine = wrapper.findAll('.the-category-plan-lines__line')[0]
        await firstLine.trigger('click')
        expect(wrapper.emitted('clickLine')).toHaveLength(1)
        const [payload] = wrapper.emitted('clickLine')![0]
        expect(payload).toMatchObject({
            id: 'cat-1',
            categoryId: 'cat-1',
            categoryName: 'Продукты',
            percent: 60,
            remainderCents: 4000
        })
    })

    it('при пустом items рендерит пустой список', () => {
        const wrapper = mountWithProviders(TheCategoryPlanLines, { props: { items: [] } })
        expect(wrapper.findAll('.the-category-plan-lines__line')).toHaveLength(0)
    })
})
