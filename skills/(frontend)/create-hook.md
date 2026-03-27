---
name: create-hook
description: Generate a custom React hook following project conventions
triggers:
  - create hook
  - add hook
  - new hook
  - make hook
requires:
  - /specs/_conventions.md
version: 1.0.0
---

# Skill: Create Hook

Before generating, read `/specs/_conventions.md`.

## Step 1 — Classify the Hook

Ask the user:
1. **What is the hook's purpose?**
   - Wraps a controller → `use-[entity]-controller.ts` in `business-core/presentation/hooks/`
   - Shared UI utility (no business logic) → `use-[name].ts` in `shared/hooks/`
   - Encapsulates logic for a specific smart component → `use-[name].ts` co-located in `features/[feature]/components/[name]/`
2. **What does it accept as parameters?** (if any)
3. **What does it return?**

---

## Pattern 1: Controller Hook

Located at `business-core/presentation/hooks/use-[entity]-controller.ts`

```typescript
import { make[Entity]Controller } from '../controllers/[entity]/make-[entity]-controller'
import type { [Entity]Controller } from '../controllers/[entity]/[entity].controller'

export function use[Entity]Controller(): [Entity]Controller {
  return make[Entity]Controller()
}
```

Rules:
- Calls the factory, returns the controller instance
- No state, no effects — pure instantiation
- If the controller needs to be memoized in the future, that optimization is added here

---

## Pattern 2: Shared Utility Hook

Located at `shared/hooks/use-[name].ts`

```typescript
import { useState } from 'react'

type Use[Name]Options = {
  // optional configuration
  initialValue?: string
}

type Use[Name]Return = {
  // explicit return shape
  value: string
  setValue: (v: string) => void
  reset: () => void
}

export function use[Name]({ initialValue = '' }: Use[Name]Options = {}): Use[Name]Return {
  const [value, setValue] = useState(initialValue)

  const reset = () => setValue(initialValue)

  return { value, setValue, reset }
}
```

Rules:
- Define `Options` and `Return` types explicitly
- Destructure options with defaults in the parameter
- Return plain object (not array) unless the hook is analogous to `useState`
- No business logic, no store access, no controller calls

---

## Pattern 3: Component-Scoped Hook

Co-located with its smart component at `features/[feature]/components/[name]/use-[name].ts`.

Use when a smart component has enough logic to extract — controller calls, store selectors, derived state, event handlers.

```typescript
'use client'

import { useState } from 'react'
import { use[Entity]Controller } from 'business-core/presentation/hooks/use-[entity]-controller'
import { useUserStore } from 'features/providers/user-provider/stores/user-store.context'
// import other hooks as needed

type Use[Name]Return = {
  data: [Entity] | null
  isLoading: boolean
  handle[Action]: (id: string) => Promise<void>
}

export function use[Name](): Use[Name]Return {
  const controller = use[Entity]Controller()
  const user = useUserStore((state) => state.user)
  const [data, setData] = useState<[Entity] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handle[Action](id: string) {
    setIsLoading(true)
    const result = await controller.getById({ id })
    setData(result)
    setIsLoading(false)
  }

  return { data, isLoading, handle[Action] }
}
```

Rules:
- `'use client'` required (uses React hooks)
- Co-located with its component — not shared across features
- Type the return shape explicitly
- The component file imports from `'./use-[name]'` (relative, within the same folder)

---

## Step 2 — Generate the Spec File

Always create a co-located `[name].spec.ts`.

### Controller hook spec
```typescript
import { use[Entity]Controller } from './use-[entity]-controller'
import { [Entity]Controller } from '../controllers/[entity]/[entity].controller'

describe('use[Entity]Controller', () => {
  it('returns an instance of [Entity]Controller', () => {
    const controller = use[Entity]Controller()
    expect(controller).toBeInstanceOf([Entity]Controller)
  })
})
```

### Component-scoped hook spec (using renderHook + providers)
```typescript
import { renderHook, act } from '@testing-library/react'
import { faker } from '@faker-js/faker'
import { UserProvider } from 'features/providers/user-provider/user-provider'
import { use[Name] } from './use-[name]'

const fakeUser = { id: faker.string.uuid(), name: faker.person.fullName(), /* ...fields */ }

function wrapper({ children }: { children: React.ReactNode }) {
  return <UserProvider user={fakeUser}>{children}</UserProvider>
}

describe('use[Name]', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => use[Name](), { wrapper })
    expect(result.current.data).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })
})
```

### Utility hook spec (using renderHook)
```typescript
import { renderHook, act } from '@testing-library/react'
import { use[Name] } from './use-[name]'

describe('use[Name]', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => use[Name]())
    expect(result.current.value).toBe('')
  })

  it('resets to initial value', () => {
    const { result } = renderHook(() => use[Name]({ initialValue: 'hello' }))
    act(() => result.current.reset())
    expect(result.current.value).toBe('hello')
  })
})
```

---

## Rules
→ Export rules: [code-conventions.md — Export Patterns](docs/(frontend)/code-conventions.md#export-patterns)
- No `'use client'` directive on hooks in `business-core/` (not React-specific)
- Type the return shape explicitly — don't rely on inference alone for public hooks
