---
description: Rules for writing unit, component, and E2E tests
globs:
  - "src/**/*.spec.ts"
  - "test/**"
  - "src/**/*.vue"
  - "src/**/*.ts"
---

- Unit/component specs: colocate as `*.spec.ts` beside source; use `mountWithProviders`, `createTestingPinia`, `vi.mock` for API/toast
- E2E (`test/e2e/`): `page.route()` for API mocks; selectors — `getByLabel()` / `getByRole()` (TheInput/TheSelect pass label as aria-label); for validation: trigger blur (focus adjacent field), not click on disabled button; `data-testid` for complex cases

Full guide: `docs/guide-testing.md`
