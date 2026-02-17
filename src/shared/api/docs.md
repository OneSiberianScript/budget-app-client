# API layer

**request(options)** — typed wrapper over httpClient.request. Use for all API calls. Options: method, url, data, params, etc. Set `_suppressErrorNotification: true` to skip global error toast (e.g. refresh, logout).

**httpClient** — axios instance with interceptors: request adds Bearer token from session store; response on 401 calls refresh, then retries once or redirects to login.

**toApiError(error)** — parses backend shape `{ error: { code, message } }` into `{ code, message }`. Use in catch blocks for user-facing messages.

**useApi(fn, { immediate? })** — composable: runs async fn, exposes data, error, isLoading, execute. Optional immediate run on mount.
