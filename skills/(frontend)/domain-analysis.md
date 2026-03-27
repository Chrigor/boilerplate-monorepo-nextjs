---
name: domain-analysis
description: Analyze a feature request and map affected layers, files to create/modify, and reuse opportunities
triggers:
  - analyze feature
  - domain analysis
  - what files do I need
  - plan this feature
  - map this feature
requires:
  - /specs/_conventions.md
  - /docs/architecture.md
  - /docs/smart-components.md
  - /docs/dumb-components.md
version: 1.0.0
---

# Skill: Domain Analysis

Before responding, read `/specs/_conventions.md` and `/docs/architecture.md`.

## Step 1 — Understand the Request

Ask if not clear:
1. What is the feature's purpose? (user-facing description)
2. Does it involve new data (new entity)? If so, what fields?
3. Does it need API calls? Which operations (read, create, update, delete)?
4. Does it need UI? What does the user see/do?
5. Is it accessible to all users or only authenticated users?

---

## Step 2 — Map Affected Layers

For each layer, determine: **new file**, **modify existing**, or **not affected**.

### Domain layer
- Is there a new entity? → new `[name].entity.ts`
- Is an existing entity extended? → modify existing entity file

### Application layer
- New repository operations? → new or modified `[name].repository.ts`

### Infrastructure layer
- New HTTP calls? → new `http-[name].repository.ts` or add methods to existing
- New factory? → `make-[name]-controller.ts` (or `make-http-client.ts` if config changes needed)

### Presentation / Controllers
- New input validation needed? → new or modified `[name].schema.ts`
- New controller methods? → new or modified `[name].controller.ts`

### Presentation / Hooks
- New hook for React components? → new `use-[name]-controller.ts`

### Presentation / Schemas
- New form with validation? → new `[domain]/[form-name].schema.ts`

### Features
- New page? → `app/(authenticated|unauthenticated)/[route]/page.tsx`
- New smart component? → `features/[feature]/components/[name].tsx`
- New provider/store? → `features/providers/[name]/` (only if scoped state is needed)

### Shared
- Reusable UI needed? → check existing `shared/components/` first
- New utility hook? → `shared/hooks/use-[name].ts`

---

## Step 3 — Identify Reuse Opportunities

Check before suggesting new files:
- Does an existing component in `shared/components/` cover the UI needs?
- Does an existing utility hook in `shared/hooks/` already solve the problem?
- Does an existing controller already have the needed method?
- Can the existing `HttpClient` handle the new endpoint without changes?

---

## Step 4 — Output a Plan

Produce a structured list:

```
NEW FILES:
  business-core/domain/entities/[name].entity.ts
  business-core/application/repositories/[name].repository.ts
  business-core/infra/repositories/http-[name].repository.ts
  business-core/presentation/controllers/[name]/[name].controller.ts
  business-core/presentation/controllers/[name]/[name].schema.ts
  business-core/presentation/controllers/[name]/make-[name]-controller.ts
  business-core/presentation/hooks/use-[name]-controller.ts
  features/[feature]/components/[name].tsx
  app/(authenticated)/[route]/page.tsx

MODIFY EXISTING:
  [file path] — reason

REUSE (no changes needed):
  shared/components/[name]/ — use for UI layout
  business-core/infra/ — HttpClient already handles auth

TESTS TO CREATE:
  [one spec file per new source file]
```

---

## Step 5 — Suggest Skill Sequence

Recommend the order to use skills:
1. `/create-spec` — define entity and repository
2. `/create-controller` — controller, infra, factory, hook
3. `/create-component` — smart + dumb components
4. `/create-unit-test` — test each layer
