---
name: create-unit-test
description: Generate unit tests for a given file following project test patterns
triggers:
  - create test
  - add test
  - write tests
  - generate tests
  - create unit test
requires:
  - /docs/testing-strategy.md
  - /specs/_conventions.md
version: 1.0.0
---

# Skill: Create Unit Test

Before generating, read `/docs/testing-strategy.md` and the **target file** in full.

## Step 1 — Identify the Layer

Read the file path to determine what to mock:

| Layer | File path pattern | What to mock |
|-------|------------------|-------------|
| Infra / Repository | `infra/repositories/` | `HttpClient` methods (`get`, `post`, etc.) |
| Controller | `presentation/controllers/` | Repository interface methods |
| Controller factory | `make-[name]-controller.ts` | Nothing — verify instance type |
| Hook | `presentation/hooks/` | Nothing for controller hooks — verify instance type |
| Shared hook | `shared/hooks/` | Nothing — test behavior directly with `renderHook` |
| Dumb component | `shared/components/` | Nothing — render and assert DOM |
| Smart component | `features/*/components/` | Wrap in providers; mock controllers if needed |

---

## Step 2 — Generate Tests

### Repository test pattern
```typescript
import { faker } from '@faker-js/faker'
import { Http[Name]Repository } from './http-[name].repository'
import type { HttpClient } from '../client.http'

const fake[Name] = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  // map all required fields
}

const mockHttp = {
  get: jest.fn().mockResolvedValue({ data: fake[Name] }),
} as unknown as HttpClient

describe('Http[Name]Repository', () => {
  const repo = new Http[Name]Repository(mockHttp)

  it('getById calls correct endpoint and returns data', async () => {
    const result = await repo.getById({ id: fake[Name].id })
    expect(mockHttp.get).toHaveBeenCalledWith(`/[names]/${fake[Name].id}`)
    expect(result).toEqual(fake[Name])
  })
})
```

### Controller test pattern
```typescript
import { faker } from '@faker-js/faker'
import { [Name]Controller } from './[name].controller'
import type { [Name]Repository } from 'business-core/application/repositories/[name].repository'

const fake[Name] = { id: faker.string.uuid(), ... }

const mockRepo: [Name]Repository = {
  getById: jest.fn().mockResolvedValue(fake[Name]),
  getAll: jest.fn().mockResolvedValue([fake[Name]]),
}

describe('[Name]Controller', () => {
  const controller = new [Name]Controller(mockRepo)

  it('getById validates input and calls repository', async () => {
    const result = await controller.getById({ id: fake[Name].id })
    expect(mockRepo.getById).toHaveBeenCalledWith({ id: fake[Name].id })
    expect(result).toEqual(fake[Name])
  })

  it('getById throws ZodError for invalid input', async () => {
    await expect(controller.getById({ id: 'short' })).rejects.toThrow()
  })
})
```

### Factory test pattern
```typescript
import { make[Name]Controller } from './make-[name]-controller'
import { [Name]Controller } from './[name].controller'

describe('make[Name]Controller', () => {
  it('returns a [Name]Controller instance', () => {
    const controller = make[Name]Controller()
    expect(controller).toBeInstanceOf([Name]Controller)
  })
})
```

### Dumb component test pattern
```typescript
import { render, screen } from '@testing-library/react'
import { [Name] } from './'

describe('[Name]', () => {
  it('renders with required props', () => {
    render(<[Name] title="Test Title" description="Test description" />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('renders optional elements when provided', () => {
    render(<[Name] title="T" description="D" image={{ src: '/img.jpg', alt: 'Alt' }} />)
    expect(screen.getByRole('img', { name: 'Alt' })).toBeInTheDocument()
  })

  it('does not render optional elements when not provided', () => {
    render(<[Name] title="T" description="D" />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
```

### Smart component test pattern
```typescript
import { render, screen } from '@testing-library/react'
import { faker } from '@faker-js/faker'
import { UserProvider } from 'features/providers/user-provider/user-provider'
import { [Name] } from './[name]'

const fakeUser = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  role: 'ADMIN' as const,
  accountId: faker.string.uuid(),
}

function renderWithProvider() {
  return render(
    <UserProvider user={fakeUser}>
      <[Name] />
    </UserProvider>
  )
}

describe('[Name]', () => {
  it('renders user name', () => {
    renderWithProvider()
    expect(screen.getByText(fakeUser.name)).toBeInTheDocument()
  })
})
```

---

## Rules
- One `describe` block per exported function/class/component
- Test behavior, not implementation (don't assert internal state)
- Use `faker` for all test data — no hardcoded strings
- Every test that should throw uses `rejects.toThrow()` or `expect(() => ...).toThrow()`
- Spec file is co-located with the source file
