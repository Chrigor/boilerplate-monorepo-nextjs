---
name: refactor
description: Identify convention violations in existing code and suggest minimal corrections
triggers:
  - refactor
  - check conventions
  - review this file
  - fix conventions
  - does this follow conventions
requires:
  - /specs/_conventions.md
  - /docs/code-conventions.md
  - /docs/architecture.md
version: 1.0.0
---

# Skill: Refactor

Before analyzing, read `/specs/_conventions.md`, `/docs/code-conventions.md`, and `/docs/architecture.md`.

Then read the target file(s) in full.

---

## Step 1 — Check Convention Violations

For each file, verify:

### File location
- Is the file in the correct layer folder?
- Smart components in `features/`? Dumb in `shared/components/`?
- Controller in `business-core/presentation/controllers/[entity]/`?
- Hook in correct location (`business-core/presentation/hooks/` or `shared/hooks/`)?

### File naming
- kebab-case? Correct suffix (`.entity.ts`, `.repository.ts`, `.controller.ts`, etc.)?

### Exports
- Named exports only? (No `export default` except Next.js pages/layouts)
- Components use `export function [Name]` (not `export const [Name] = () =>`)

### Dependency direction
- Is the file importing from a layer it should not depend on?
- e.g., `shared/` importing from `features/` — violation
- e.g., `domain/` importing from `infra/` — violation

### Validation placement
- Controller-level validation in controller's `[name].schema.ts`?
- UI/form validation in `presentation/schemas/[domain]/`?
- Are Zod schemas named `[Name]Schema`?

### Component classification
- Does a "dumb" component access a Zustand store? → it's actually smart, move it to `features/`
- Does a "smart" component have no store/controller access? → it can be dumb, move to `shared/`

### Factory pattern
- Does the controller have a corresponding factory (`make-[name]-controller.ts`)?
- Does the factory compose: `makeHttpClient()` → `new Http[Name]Repository` → `new [Name]Controller`?

### Store usage
- Is the store using the correct pattern (global `create` vs scoped `createStore`)?
- Is `useUserStore` called outside a `UserProvider`? → will throw at runtime

---

## Step 2 — Output Violations

List each violation with:
- **File**: path
- **Violation**: what rule is broken
- **Fix**: minimal change required

Example:
```
File: shared/components/[name]/index.tsx
Violation: imports from useAuthStore — shared components must not access stores
Fix: accept data as props instead, move to features/ if store access is required

File: features/[feature]/components/[name].tsx
Violation: uses export default
Fix: change to named export: export function [Name](...)
```

---

## Step 3 — Apply Fixes

Only apply changes that:
- Correct convention violations
- Do not change behavior
- Are minimal (no rewrites, no new features, no cleanup beyond what was asked)

Do not:
- Add comments or documentation
- Extract new helpers unless the convention requires it
- Rename variables that follow the conventions but could be "cleaner"
- Fix things that aren't convention violations (e.g., unused variables are a linter concern, not a convention violation)
