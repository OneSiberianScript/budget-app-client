---
description: Web security rules — XSS, token storage, CSRF, validation
globs:
  - "src/**/*.vue"
  - "src/**/*.ts"
---

- `v-html` only for fully trusted content — never for user input
- Never bind raw user input to `:href` (risk of `javascript:` injection)
- Do not store tokens in `localStorage`/`sessionStorage` — access token lives in Pinia (memory); refresh token in `httpOnly` cookie
- Axios uses `withCredentials: true` — aligns with backend `SameSite` cookie strategy
- Run `npm audit` regularly; critical validation must be enforced on the backend
