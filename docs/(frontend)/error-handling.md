# Error Handling

## Approach

Two layers of error handling exist in this project:

1. **HTTP errors** — handled in `HttpClient` (throws typed `HttpError`)
2. **Route errors** — handled by Next.js error boundaries (`error.tsx` files)

---

## HTTP Error Handling (`HttpClient`)

Located at `business-core/infra/client.http.ts`.

When a response is not `ok` (status >= 400), `HttpClient` throws an `HttpError`:

```typescript
export interface HttpError extends Error {
  status: number
  data: unknown
}
```

The error message is extracted from the response body (`data.message`) or falls back to `response.statusText`.

**Consumers** (repositories, controllers) do not catch HTTP errors — they propagate up to the component or page that called them.

---

## Route Error Boundaries (Next.js)

Next.js App Router error boundaries are defined as `error.tsx` files alongside `page.tsx`.

### Pattern: `error.tsx` (co-located with `page.tsx`)

```typescript
'use client'

interface RouteErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function RouteError({ error, reset }: RouteErrorProps) {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex w-full max-w-md flex-col gap-4 rounded-lg border border-red-200 p-6">
        <h2 className="text-lg font-semibold text-red-600">
          Erro ao carregar página
        </h2>
        <p className="text-sm text-gray-600">
          {error.message || 'Ocorreu um erro inesperado.'}
        </p>
        <button onClick={reset} className="...">
          Tentar novamente
        </button>
      </div>
    </main>
  )
}
```

### Rules for error boundaries
- Must be `'use client'`
- Must use `export default` (Next.js requirement)
- Props: `{ error: Error & { digest?: string }, reset: () => void }`
- Always provide a `reset` button so users can retry
- Display `error.message` with a fallback for unexpected errors
- Styled consistently: `border-red-200`, `text-red-600` heading, `text-gray-600` description

---

## Where to Add Error Boundaries

Add an `error.tsx` file whenever a page does async work (server components, data fetching). Co-locate it with `page.tsx` in the same route segment.

```
app/
  (authenticated)/
    [route]/
      page.tsx       ← async server component
      error.tsx      ← catches errors from page.tsx
```

---

## What Is Not Handled

- Client-side unhandled rejections (no global error handler)
- Toast/notification system for non-fatal errors (not yet implemented)
- Retry logic at the HTTP layer (not implemented)
