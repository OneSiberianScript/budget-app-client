import { Apps24Regular, BuildingBank24Regular, Wallet24Regular, Home24Regular } from '@vicons/fluent'
import { describe, it, expect } from 'vitest'

import { getCategoryIconComponent } from './icon-map'

describe('getCategoryIconComponent', () => {
    it('возвращает иконку по умолчанию для null и пустой строки', () => {
        expect(getCategoryIconComponent(null)).toBe(Apps24Regular)
        expect(getCategoryIconComponent('')).toBe(Apps24Regular)
    })

    it('возвращает иконку по известному ключу (без учёта регистра)', () => {
        expect(getCategoryIconComponent('wallet')).toBe(Wallet24Regular)
        expect(getCategoryIconComponent('Wallet')).toBe(Wallet24Regular)
        expect(getCategoryIconComponent('WALLET')).toBe(Wallet24Regular)
        expect(getCategoryIconComponent('home')).toBe(Home24Regular)
    })

    it('нормализует пробелы и дефисы в ключе', () => {
        expect(getCategoryIconComponent('  wallet  ')).toBe(Wallet24Regular)
        expect(getCategoryIconComponent('building-bank')).toBe(BuildingBank24Regular)
    })

    it('возвращает иконку по умолчанию для неизвестного имени', () => {
        expect(getCategoryIconComponent('unknown')).toBe(Apps24Regular)
        expect(getCategoryIconComponent('xyz')).toBe(Apps24Regular)
    })
})
