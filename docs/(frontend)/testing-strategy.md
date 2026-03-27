# Testing Strategy

## Test Runner and Libraries

| Tool | Role |
|------|------|
| **Bun** | Test runner (`bun test`) |
| **@testing-library/react** | Component rendering and interaction |
| **@testing-library/user-event** | User interactions (typing, clicking) |
| **@testing-library/jest-dom** | DOM assertion matchers (`toBeInTheDocument`, etc.) |
| **@faker-js/faker** | Generating realistic test data |
| **happy-dom** | DOM environment (`@happy-dom/global-registrator`) |

Setup file at root `setup.ts` (and per-package `setup.ts`):
```typescript
import { GlobalRegistrator } from '@happy-dom/global-registrator'
GlobalRegistrator.register()
require('@testing-library/jest-dom')
afterEach(() => { cleanup() })
```

---

## Test File Naming and Location

- All spec files are **co-located** with the file they test
- Naming: `[filename].spec.ts` for pure logic, `[filename].spec.tsx` for React components
- Examples:
  - `[name].controller.spec.ts` next to `[name].controller.ts`
  - `[name]-form.spec.tsx` next to `[name]-form.tsx`
  - `use-[name].spec.ts` next to `use-[name].ts`

---

## What Is Tested

### Infrastructure Layer
- `HttpClient` — URL building, request construction, response parsing, error handling, auth headers
- HTTP client factory — produces correctly configured instance
- `Http[Entity]Repository` — calls correct endpoints with correct data

### Presentation Layer
- `[Entity]Controller` — validates input (Zod), delegates to repository
- Controller factory — returns correct controller instance
- Controller hook — returns correct controller instance

### Feature Components
- Smart components — form validation, submit behavior, store data rendering

### Shared Components
- Dumb components — render correctly with required props, handle optional props

### Shared Hooks
- Utility hooks — behavior for each exposed action

### UI Package
- Primitives from `@repo/ui` — render, apply className, forward props

---

## What Is Not Tested

- Next.js pages (`app/*/page.tsx`) — thin orchestration layers with no logic
- Layouts (`app/*/layout.tsx`) — structural wrappers
- Store definitions (`*.store.ts`, `*-store.context.ts`) — tested indirectly via component tests
- Zod schemas — tested indirectly through controller and form tests

---

## Mock Patterns

### Mocking HTTP requests (infra tests)
Use `jest.fn()` / `bun`'s mock to spy on `fetch` or mock `HttpClient` methods:
```typescript
const mockGet = jest.fn().mockResolvedValue({ data: fakeUser })
const mockHttp = { get: mockGet } as unknown as HttpClient
const repo = new HttpUserRepository(mockHttp)
```

### Mocking repositories (controller tests)
Create a mock implementing the repository interface:
```typescript
const mockRepo: UserRepository = {
  getById: jest.fn().mockResolvedValue(fakeUser),
  getMe: jest.fn().mockResolvedValue(fakeUser),
}
const controller = new UserController(mockRepo)
```

### Generating test data
Use `@faker-js/faker` for realistic data:
```typescript
import { faker } from '@faker-js/faker'
const fakeUser = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
}
```

### Rendering components with store context
Wrap in providers as needed:
```typescript
render(<UserProvider user={fakeUser}><SmartComponent /></UserProvider>)
```

---

## Running Tests

```bash
# All tests
bun test

# Watch mode
bun test --watch

# Specific file
bun test path/to/file.spec.ts
```
