# API Contracts

## HTTP Client

Located at `business-core/infra/client.http.ts`. Custom `fetch` wrapper — no third-party HTTP library.

### Configuration

```typescript
interface HttpClientOptions {
  baseURL: string                      // required, trailing slash stripped automatically
  credentials?: RequestCredentials     // default: 'omit'
  token?: string                       // added as Bearer token if provided
}
```

Instantiated via factory:
```typescript
// business-core/infra/make-http-client.ts
export function makeHttpClient(): HttpClient {
  return new HttpClient({
    baseURL: process.env.API_BASE_URL ?? 'http://localhost:3000',
  })
}
```

---

### Methods

All methods return `Promise<HttpResponse<T>>`:

```typescript
interface HttpResponse<T = unknown> {
  data: T
  status: number
  statusText: string
}
```

| Method | Signature |
|--------|-----------|
| GET | `http.get<T>(url, config?)` |
| POST | `http.post<T>(url, data?, config?)` |
| PUT | `http.put<T>(url, data?, config?)` |
| PATCH | `http.patch<T>(url, data?, config?)` |
| DELETE | `http.delete<T>(url, config?)` |

### Request Config

```typescript
interface HttpConfig {
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean>  // serialized as query string
  signal?: AbortSignal
}
```

---

### Error Contract

On non-2xx responses, throws `HttpError`:

```typescript
interface HttpError extends Error {
  status: number    // HTTP status code
  data: unknown     // parsed response body
}
```

Error message is extracted from `response.data.message` or falls back to `response.statusText`.

---

### Response Parsing

- `Content-Type: application/json` → JSON parsed
- Empty body → returns `null`
- Non-JSON content type → returns raw text

---

## Known API Endpoints

Derived from repository implementations:

| Method | Endpoint | Used by |
|--------|----------|---------|
| GET | `/users/:id` | `HttpUserRepository.getById` |
| GET | `/users/me` | `HttpUserRepository.getMe` |

---

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `API_BASE_URL` | `http://localhost:3000` | Base URL for all API requests |

Defined in `process.env` and read in `make-http-client.ts`.
