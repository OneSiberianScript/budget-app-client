# UI/UX Improvement Plan — Budget App Client

## Контекст

Текущий дашборд (HomePage) — donut-чарт с месячным picker'ом и двумя табами.
Цель: переход к современному bento-дашборду с полным набором улучшений UX 2026:
крупная типографика, pulse charts, progress rings, прогноз перерасхода, activity feed,
onboarding для новых пользователей, View Transitions и count-up анимации.

---

## Архитектурные решения

- **Dashboard**: полная замена HomePage.vue — bento grid вместо pie chart
- **Activity Feed**: строится из транзакций (`createdById` → имя из budget-members)
- **Анимации**: View Transitions API (router-level) + count-up через @vueuse/core `useTransition`
- **Progress rings**: новый SVG-компонент `TheProgressRing.vue` — заменяет fill-bar в CategoryCard
- **Pulse chart**: новый ECharts-компонент `TheSpendingPulseChart.vue` над таблицей транзакций
- **Прогноз**: клиентская логика (`useForecast.ts`) — экстраполяция от текущего темпа расходов

---

## Фазы реализации

---

### Фаза 1 — Утилиты и базовые компоненты

#### 1.1 `useViewTransition.ts`
**Файл**: `src/shared/lib/useViewTransition.ts`

Компосабл для плавных переходов между страницами через браузерный View Transitions API.

```typescript
// Публичный API:
function useViewTransition(): {
  navigate: (fn: () => void | Promise<void>) => Promise<void>
  isSupported: Readonly<Ref<boolean>>
}
```

**Интеграция с роутером** (`src/app/providers/router/index.ts`):
- В `router.beforeEach` оборачивать навигацию в `document.startViewTransition()`
- Graceful degradation: если API не поддерживается — обычная навигация

**CSS** (`src/app/styles/style.css`):
```css
::view-transition-old(root) {
  animation: 150ms ease-out fade-out;
}
::view-transition-new(root) {
  animation: 200ms ease-in fade-in;
}
@keyframes fade-out { to { opacity: 0; } }
@keyframes fade-in { from { opacity: 0; } }
```

---

#### 1.2 `useCountUp.ts`
**Файл**: `src/shared/lib/useCountUp.ts`

Анимированный счётчик для числовых значений (баланс, суммы).

```typescript
// Публичный API:
function useCountUp(
  target: Ref<number> | ComputedRef<number>,
  options?: { duration?: number; formatter?: (v: number) => string }
): { displayValue: Readonly<Ref<string>> }
```

**Реализация**: `useTransition` из `@vueuse/core` (уже установлен) с easing `easeOutExpo`.
Запускается при монтировании и при каждом изменении `target`.

---

#### 1.3 `useForecast.ts`
**Файл**: `src/shared/lib/useForecast.ts`

Прогноз расходов на конец месяца по текущему темпу.

```typescript
// Публичный API:
function useForecast(params: {
  actualCents: Ref<number>
  plannedCents: Ref<number>
  month: Ref<string> // YYYY-MM
}): {
  projectedCents: ComputedRef<number>     // экстраполированные расходы
  overrunCents: ComputedRef<number>       // > 0 значит превышение
  progressPercent: ComputedRef<number>   // actual / planned * 100
  daysElapsed: ComputedRef<number>
  daysTotal: ComputedRef<number>
}
```

**Формула**:
```
daysElapsed = min(today - startOfMonth + 1, daysInMonth)
rate = actualCents / daysElapsed
projectedCents = rate * daysTotal
overrunCents = projectedCents - plannedCents
```

Если `daysElapsed === 0` → `projectedCents = 0`.

---

#### 1.4 `TheProgressRing.vue`
**Файл**: `src/shared/ui/TheProgressRing.vue`
**Экспорт**: добавить в `src/shared/ui/index.ts`

SVG progress ring — замена fill-bar в CategoryCard.

```typescript
// Props:
interface Props {
  percent: number        // 0–100
  color?: string         // hex, default: var(--color-accent-primary)
  size?: number          // px, default: 48
  strokeWidth?: number   // default: 4
  showLabel?: boolean    // центральный текст с процентом
}
```

**SVG-реализация**: `<circle>` с `stroke-dasharray` и `stroke-dashoffset`.
`stroke-dashoffset = circumference * (1 - percent / 100)`
Анимация: `transition: stroke-dashoffset 0.6s ease-out`.

---

### Фаза 2 — Редизайн главной страницы

#### 2.1 `TheActivityFeed.vue`
**Файл**: `src/shared/ui/TheActivityFeed.vue`
**Экспорт**: добавить в `src/shared/ui/index.ts`

```typescript
// Props:
interface Props {
  transactions: Transaction[]
  members: BudgetMember[]
  categories: Category[]
  maxItems?: number // default: 8
}
```

**Логика**: берёт последние `maxItems` транзакций по `createdAt`, маппит:
- `createdById` → имя из `members` (или «Вы» если `sessionStore.user.id`)
- `categoryId` → название/цвет категории
- Формат строки: `«{Имя} добавил -500 ₽ · Кафе · сегодня в 14:32»`

**Компонент**: список элементов с аватаром (инициалы), текстом, временем.
Использует `formatMoney()` из `src/shared/lib/format-money.ts`.
Использует `formatDate()` из `src/shared/lib/date.ts`.

---

#### 2.2 `TheOnboardingCard.vue`
**Файл**: `src/shared/ui/TheOnboardingCard.vue`

Показывается вместо bento если нет категорий или транзакций.

```typescript
// Props:
interface Props {
  hasCategories: boolean
  hasTransactions: boolean
}
// Emits: 'go-categories' | 'go-add-transaction'
```

**Шаги**:
1. «Создай первую категорию» → `router.push(ROUTE_NAMES.CATEGORY_CREATE)`
2. «Добавь первую транзакцию» → открыть QuickTransactionFab (emit)

**Визуал**: карточка с двумя шагами, текущий шаг подсвечен, выполненный — отмечен галочкой.

---

#### 2.3 Редизайн `HomePage.vue`
**Файл**: `src/pages/home/ui/HomePage.vue` — **полная замена**

**Структура bento-grid (CSS Grid)**:
```
Mobile (1 col):       Tablet (2 col):        Desktop (3 col):
┌──────────────┐      ┌────────┬────────┐     ┌────────┬────────┬────────┐
│ Баланс       │      │Баланс  │ Top-3  │     │Баланс  │ Top-3  │ Plan % │
│ месяца       │      │месяца  │ categ. │     │месяца  │ categ. │        │
├──────────────┤      ├────────┤        │     ├────────┴────────┤        │
│ Топ-3 катег. │      │Plan %  ├────────┤     │  Pie chart      ├────────┤
├──────────────┤      │        │Activity│     │                 │Activity│
│ Прогресс     │      │        │ feed   │     │                 │ feed   │
│ плана        │      ├────────┴────────┤     └────────────────┴────────┘
├──────────────┤      │ Pie chart       │
│ Activity feed│      └─────────────────┘
├──────────────┤
│ Pie chart    │
└──────────────┘
```

**Карточки**:

**A. Баланс месяца** (`HomeSummaryCard.vue`):
- Крупная сумма расходов (48px, `useCountUp`) в центре
- Под ней: Доходы / Расходы в две колонки
- Индикатор: `+N%` к прошлому месяцу (если данные есть)
- Месячный picker остаётся

**B. Топ-3 категории** (`HomeTopCategoriesCard.vue`):
- 3 категории с наибольшими тратами
- Каждая: иконка + название + сумма + mini progress bar
- Линк «Все категории →»

**C. Прогресс плана** (`HomePlanProgressCard.vue`):
- Общий % выполнения плана (сумма actual / сумма planned)
- Крупный процент + `TheProgressRing`
- Прогноз: «Превысишь на X ₽» или «В норме» (из `useForecast`)

**D. Pie chart** (перенос текущего, уменьшенный):
- Существующая логика без изменений
- Tabs expense/income остаются
- Размер уменьшается под карточку

**E. Activity Feed** — `TheActivityFeed.vue`

**Состояние загрузки**: `usePageData` — скелетоны через `a-skeleton`

**Empty state**: `TheOnboardingCard.vue` вместо всего bento

**Данные**: добавить к существующим запросам `budgetMemberStore.fetchBudgetMembers(budgetId)`.

**Файловая структура**:
```
src/pages/home/ui/
├── HomePage.vue               # корневой — grid + условный рендер
├── HomeSummaryCard.vue        # карточка баланса
├── HomeTopCategoriesCard.vue  # топ-3
├── HomePlanProgressCard.vue   # прогресс плана + прогноз
└── index.ts
```

---

### Фаза 3 — Pulse Chart на странице транзакций

#### 3.1 `TheSpendingPulseChart.vue`
**Файл**: `src/shared/ui/TheSpendingPulseChart.vue`
**Экспорт**: добавить в `src/shared/ui/index.ts`

```typescript
// Props:
interface Props {
  transactions: Transaction[]
  month: string        // YYYY-MM, для расчёта дней
  type?: 'expense' | 'income' | 'all'  // default: 'all'
  categoryIds?: string[]  // фильтр (пустой = все)
}
```

**ECharts конфиг**: area chart (type: 'line', areaStyle: {}).
**Данные**: агрегация `transactions` по `occurredAt` → сумма по дням.
**Ось X**: все дни месяца (1..N), сегодня подсвечен.
**Ось Y**: сумма в рублях (formatMoney).
**Тема**: использует текущую тему через `useTheme()`.
**Responsive**: `autoresize`.

#### 3.2 Интеграция в `TransactionsPage.vue`
**Файл**: `src/pages/transactions/ui/TransactionsPage.vue`

- Добавить `TheSpendingPulseChart` над таблицей
- Высота: 160px mobile, 200px desktop
- Реагирует на активные фильтры (category, type, period)
- Скрывается если нет транзакций (`v-if="transactions.length"`)

---

### Фаза 4 — Progress rings в категориях и прогноз в планах

#### 4.1 Обновление `CategoryCard.vue`
**Файл**: `src/features/category/category-card/ui/CategoryCard.vue`

Заменить fill-bar на `TheProgressRing`:
- `percent` = `fillPercent` (уже вычислен)
- `color` = `category.color`
- `size` = 56 (иконка внутри, 20px)
- `showLabel` = false (иконка занимает центр)

Убрать: CSS `background: 25% color + fill rectangle`.
Добавить: `TheProgressRing` + центральная иконка поверх через absolute.

#### 4.2 Обновление `BudgetPlansPage.vue`
**Файл**: `src/pages/budget-plans/ui/BudgetPlansPage.vue`

Добавить forecast banner над `TheCategoryPlanLines`:
```vue
<div v-if="overrunCents > 0" class="forecast-banner">
  При текущем темпе превысишь план на {{ formatMoney(overrunCents) }}
  ({{ daysElapsed }} из {{ daysTotal }} дней прошло)
</div>
```

`overrunCents` = сумма по всем категориям активного таба из `useForecast`.

#### 4.3 Обновление `TheCategoryPlanLines.vue`
**Файл**: `src/shared/ui/TheCategoryPlanLines.vue`

Добавить новый prop `showForecast?: boolean` и в каждую строку — tooltip или подпись:
«→ прогноз: X ₽» (только если `projectedCents > plannedCents`).

---

## Типографика (глобально)

**Файл**: `src/app/styles/tokens.css` — добавить:
```css
--font-size-display: 2.5rem;  /* 40px - крупные суммы */
--font-size-title: 1.5rem;    /* 24px - заголовки карточек */
--font-weight-display: 700;
--font-tabular-nums: 'tabular-nums'; /* для цифр */
```

Применить `font-variant-numeric: tabular-nums` к суммам — предотвращает прыжки при count-up.

---

## Критические файлы

| Файл | Действие |
|------|---------|
| `src/pages/home/ui/HomePage.vue` | Полная замена |
| `src/pages/home/ui/HomeSummaryCard.vue` | Создать |
| `src/pages/home/ui/HomeTopCategoriesCard.vue` | Создать |
| `src/pages/home/ui/HomePlanProgressCard.vue` | Создать |
| `src/pages/transactions/ui/TransactionsPage.vue` | Добавить pulse chart |
| `src/pages/budget-plans/ui/BudgetPlansPage.vue` | Добавить forecast banner |
| `src/features/category/category-card/ui/CategoryCard.vue` | Заменить fill на ring |
| `src/shared/ui/TheProgressRing.vue` | Создать |
| `src/shared/ui/TheSpendingPulseChart.vue` | Создать |
| `src/shared/ui/TheActivityFeed.vue` | Создать |
| `src/shared/ui/TheOnboardingCard.vue` | Создать |
| `src/shared/ui/index.ts` | Добавить экспорты |
| `src/shared/ui/TheCategoryPlanLines.vue` | Добавить forecast |
| `src/shared/lib/useViewTransition.ts` | Создать |
| `src/shared/lib/useCountUp.ts` | Создать |
| `src/shared/lib/useForecast.ts` | Создать |
| `src/app/providers/router/index.ts` | View Transitions hook |
| `src/app/styles/tokens.css` | Типографические токены |
| `src/app/styles/style.css` | View Transitions CSS |

---

## Зависимости между фазами

```
Фаза 1 (утилиты) → обязательна перед Фазами 2, 3, 4
Фаза 2 (дашборд) → независима от 3 и 4
Фаза 3 (pulse chart) → независима от 2 и 4
Фаза 4 (rings + forecast) → зависит от TheProgressRing (Фаза 1.4)
```

Фазы 2, 3, 4 можно реализовывать параллельно после Фазы 1.

---

## Проверка (Verification)

```bash
# TypeScript и сборка
npm run build

# Линтинг
npm run lint

# Dev server — ручная проверка
npm run dev
```

**Ручные сценарии**:
1. Открыть `/` → видеть bento-grid с count-up анимацией чисел
2. Переключить месяц → числа анимируются заново
3. Перейти в `/transactions` → pulse chart над таблицей
4. Перейти в `/categories` → прогресс-кольца вместо fill-bars
5. Перейти в `/budget-plans` → forecast banner при перерасходе
6. Переключить маршруты быстро → View Transition плавно
7. Создать новый бюджет без категорий → onboarding card
8. Проверить dark theme → все компоненты корректны
9. Мобильный viewport → bento в 1 колонку
