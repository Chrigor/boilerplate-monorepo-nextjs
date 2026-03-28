---
name: create-component
description: Generate a new React component following project conventions
---

# Skill: Create Component

Before generating anything, read `/specs/_conventions.md` and `/docs/architecture.md`.

## Step 1 — Classify the Component

Ask the user (or infer from context):
1. **Smart or dumb?**
   - Smart → goes in `features/[feature]/components/[name]/index.tsx`
   - Dumb → goes in `shared/components/[name]/index.tsx`
2. **Does it need a composition pattern?**
   - Yes (multiple structural parts) → create sub-files + barrel `index.tsx` that exports a namespace object
   - No → single `index.tsx` or `[name].tsx` file
3. **If smart: which store(s) does it consume?**
   - `useAuthStore` (global) or `useUserStore` (provider-scoped, must be inside `UserProvider`)
4. **If smart: does it need a controller?**
   - If yes, ask for the entity name and read the controller spec before generating
5. **If smart: does it have enough logic to extract into a hook?**
   - Yes (controller calls + state + handlers) → create a co-located `use-[name].ts` (see `/skills/create-hook.md` Pattern 3)
   - No → inline the logic directly in the component

---

## Step 2 — Generate the Component

### Dumb component (single file)
```typescript
import { type ComponentProps } from 'react'

type [Name]Props = ComponentProps<'div'> & {
  // additional props
}

export function [Name]({ className = '', children, ...props }: [Name]Props) {
  return (
    <div className={`base-classes ${className}`} {...props}>
      {children}
    </div>
  )
}
```

### Dumb component (composition pattern)
Create one file per part:
- `[name]-root.tsx`, `[name]-header.tsx`, `[name]-title.tsx`, etc.
- `index.tsx` barrel:
```typescript
import { [Name]Root } from './[name]-root'
import { [Name]Header } from './[name]-header'
// ...

export const [Name] = {
  Root: [Name]Root,
  Header: [Name]Header,
  // ...
}
```

### Smart component (logic inline)
```typescript
'use client'

import { useUserStore } from 'features/providers/user-provider/stores/user-store.context'
// or: import { useAuthStore } from 'features/providers/user-provider/stores/auth.store'

export function [Name]() {
  const data = useUserStore((state) => state.user)
  return (/* JSX */)
}
```

### Smart component (logic extracted to co-located hook)
```typescript
'use client'

import { use[Name] } from './use-[name]'

export function [Name]() {
  const { data, isLoading, handle[Action] } = use[Name]()
  return (/* JSX */)
}
```

The hook `use-[name].ts` lives in the same folder and encapsulates controller calls, store selectors, local state and event handlers. See `/skills/create-hook.md` Pattern 3.

---

## Step 3 — Generate the Spec File

Always create a co-located `[name].spec.tsx` or `[name].spec.ts`.

### Dumb component spec pattern
```typescript
import { render, screen } from '@testing-library/react'
import { [Name] } from './'  // or './[name]'

describe('[Name]', () => {
  it('renders [description]', () => {
    render(<[Name] title="Test" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
```

### Smart component spec pattern
Wrap in required providers:
```typescript
import { render, screen } from '@testing-library/react'
import { faker } from '@faker-js/faker'
import { UserProvider } from 'features/providers/user-provider/user-provider'
import { [Name] } from './[name]'

const fakeUser = { id: faker.string.uuid(), name: faker.person.fullName(), ... }

describe('[Name]', () => {
  it('renders user data', () => {
    render(<UserProvider user={fakeUser}><[Name] /></UserProvider>)
    expect(screen.getByText(fakeUser.name)).toBeInTheDocument()
  })
})
```

---

## Rules
→ Export rules: `docs/(frontend)/code-conventions.md` — Export Patterns section
- `'use client'` directive only on smart components or those using hooks
- Use `ComponentProps<'element'>` to extend native element props for dumb components
- Do not add comments or JSDoc unless logic is non-obvious
- Do not add features beyond what was asked
