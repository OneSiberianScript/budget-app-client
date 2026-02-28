# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev            # Dev server (port 5173, proxy /api → backend)
npm run build          # Production build with TypeScript check
npm run lint           # ESLint check
npm run lint:fix       # ESLint auto-fix
npm run format         # Prettier
npm run test:run       # Vitest once
npm run test:coverage  # Vitest + coverage
npm run test:e2e       # Playwright E2E
npm run build:analyze  # Bundle analysis with visualizer
```

Environment: copy `.env.example` → `.env`. Key vars: `VITE_API_BASE_URL`, `VITE_API_TIMEOUT_MS` (default 5000).

## Architecture: Feature-Sliced Design (FSD)

Strictly layered — **import only downward**:

```
app → pages → widgets → features → entities → shared
```

Each slice's public API is via `index.ts`. No cross-imports within the same layer (except `shared`).

**Layer roles:**
- `app/` — router, providers, root App.vue, global styles
- `pages/` — route components (suffix `Page`, e.g. `BudgetPlansPage.vue`)
- `widgets/` — composite UI blocks (layouts, nav, switchers)
- `features/` — user scenarios (`auth/login`, `monthly-plan/plan-item-form`)
- `entities/` — domain models with store + API + types (`session`, `budget`, `category`, `transaction`)
- `shared/` — `api/` (httpClient, request, useApi), `ui/` (The* components), `lib/`, `config/`

## Style

- Be terse. Give the answer immediately, show code — not high-level explanations.
- When modifying code I provide: show only changed lines with minimal context, not the whole file.
- Treat me as an expert. Suggest solutions I haven't thought about.
- When adding new public API (The* components, composables, exported functions): add JSDoc in Russian immediately and tests where applicable.

## Key Conventions

**Naming:**
- Components: PascalCase; pages: `{Name}Page.vue`; root CSS class: `kebab-case` with `-page` suffix
- Composables: `useXxx`; stores: `useXStore`
- Route constants: `ROUTE_NAMES` / `ROUTE_PATHS` — UPPER_SNAKE_CASE keys, kebab-case values
- Types: PascalCase; prefer `interface` over `type` (extendability). Avoid enums — use const maps. JSDoc in Russian for public exports.

**Code style:**
- Functional and declarative; avoid classes
- Descriptive variable names with auxiliary verbs (`isLoading`, `hasError`, `canSubmit`)
- `function` keyword for pure functions (hoisting, clarity); arrow functions for callbacks/inline
- One file — one area of responsibility

**Stores (Pinia, composition API):**
- Actions as `function` declarations (not arrow functions) for hoisting and readable stack traces

**Performance:**
- `v-memo` for expensive list items; `shallowRef`/`shallowReactive` for large structures with no need for deep reactivity
- `defineAsyncComponent` + Suspense for heavy components (modals, heavy widgets)
- In `onUnmounted`: unsubscribe from events, clear timers, cancel requests (AbortController), call `destroy`/`dispose` on third-party instances

**Shared UI components** (`shared/ui/`):
- All prefixed `The` (e.g. `TheButton`, `TheModal`, `TheInput`)
- Thin wrappers over Ant Design Vue — pass through props/slots/emit, don't duplicate library API
- Export from `shared/ui/index.ts`

## Adding a Route

1. Add to `ROUTE_NAMES` + `ROUTE_PATHS` in `src/shared/config/router.ts`
2. Add typed entry in `src/shared/config/router.types.ts` (`RouteNamedMap`)
3. Add lazy route in `src/app/providers/router/routes.ts` (404 last)
4. Create `src/pages/{kebab-name}/ui/{Name}Page.vue` + `index.ts`

Full guide: `docs/create-route.md`

## Forms

Pattern: **Zod schema → VeeValidate → The* components**

```
src/features/{feature}/{form-name}/
├── model/
│   ├── {FormName}.schema.ts   # Zod schema using primitives from @/shared/lib/validation
│   ├── {FormName}.types.ts    # z.infer type + initialValues (separate from schema)
└── ui/
    └── {FormName}.vue         # useForm + toTypedSchema + TheInput/TheSelect/etc.
```

- Use primitives from `@/shared/lib/validation` (`email`, `nonEmptyString`, `password`, etc.)
- Never use `zod.default()` — causes issues with `toTypedSchema`; keep `initialValues` separate
- Each `<TheInput>` / `<TheSelect>` must have a `name` prop matching the Zod schema key
- Always pass `label` prop to form fields — required for Playwright `getByLabel()` in E2E

Full guide: `docs/create-form.md`

## API Layer

**`shared/api/`:**
- `httpClient` — Axios with `withCredentials: true`; auto-attaches Bearer token; handles 401 with token refresh + retry (deduplicates concurrent refreshes)
- `request()` — typed wrapper, returns `response.data`; accepts `_suppressErrorNotification` flag
- `useApi()` — composable returning `{ data, error, isLoading, execute }` with optional `immediate: true`

**Entity API** lives inside the entity slice (`entities/{entity}/api/`), not in `shared/api`.

## App Initialization

`main.ts` → creates Pinia → calls `budgetStore.hydrateFromStorage()` + `sessionStore.restoreSession()` (refresh cookie → `/users/me`) → awaits `router.isReady()` → mounts. Router guard waits for `restorePromise` to resolve before nav decisions.

## UI & Layout

- **Mobile-first**: base styles for small screens, enhancements via `min-width` media queries (768px tablet, 1024px desktop)
- **No full-page scroll**: layout root is `height: 100dvh; display: flex; flex-direction: column`; header/footer fixed; content area: `flex: 1; min-height: 0; overflow-y: auto`
- **Theme**: light/dark via CSS variables on `document.documentElement[data-theme]`; stored in localStorage; system preference detection
- **Semantics**: `button` for clicks, `a` for links (href required), `img` with alt, form with labels. Flexbox/Grid for layout; rem/em for typography
- **Accessibility**: WCAG 2.1 AA — contrast, ARIA where needed, keyboard nav, focus styles. Touch targets min 44×44px

Full UI guide: `docs/guide-ui-and-responsive.md`

## Security

See `.claude/rules/security.md`

## Testing

See `.claude/rules/testing.md` and `docs/guide-testing.md`
