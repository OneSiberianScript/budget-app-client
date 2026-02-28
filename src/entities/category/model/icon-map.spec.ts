import {
    AnimalCat24Regular,
    Apps24Regular,
    Broom24Regular,
    BuildingBank24Regular,
    Games24Regular,
    HeartPulse24Regular,
    Home24Regular,
    PeopleTeam24Regular,
    Pill24Regular,
    VehicleBus24Regular,
    Wallet24Regular
} from '@vicons/fluent'
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
        expect(getCategoryIconComponent('animal-cat')).toBe(AnimalCat24Regular)
        expect(getCategoryIconComponent('people-team')).toBe(PeopleTeam24Regular)
    })

    it('возвращает новые иконки по ключу', () => {
        expect(getCategoryIconComponent('vehiclebus')).toBe(VehicleBus24Regular)
        expect(getCategoryIconComponent('pill')).toBe(Pill24Regular)
        expect(getCategoryIconComponent('broom')).toBe(Broom24Regular)
        expect(getCategoryIconComponent('heartpulse')).toBe(HeartPulse24Regular)
        expect(getCategoryIconComponent('games')).toBe(Games24Regular)
        expect(getCategoryIconComponent('animalcat')).toBe(AnimalCat24Regular)
    })

    it('возвращает иконку по умолчанию для неизвестного имени', () => {
        expect(getCategoryIconComponent('unknown')).toBe(Apps24Regular)
        expect(getCategoryIconComponent('xyz')).toBe(Apps24Regular)
    })
})
