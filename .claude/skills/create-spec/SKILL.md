---
name: create-spec
description: Generate a spec (entity definition) for a new domain entity
---

# Skill: Create Spec

Before generating, read `/specs/_conventions.md` to understand the layer structure.

## Ask the User

1. **Entity name** (e.g., `Product`, `Order`, `Event`)
2. **Fields**: name, type, required/optional for each
3. **Repository methods needed** (e.g., `getById`, `getAll`, `create`, `update`, `delete`)
4. **Any specific validation rules** (min length, enum values, format)

---

## Files to Generate

### 1. Entity — `business-core/domain/entities/[name].entity.ts`

```typescript
type [Name]Status = 'ACTIVE' | 'INACTIVE'  // enums as union types

export interface [Name] {
  id: string
  // required fields
  name: string
  // optional fields
  description?: string | null
  status?: [Name]Status
  createdAt?: string
  updatedAt?: string
}
```

Rules:
- Interface, not class
- Optional fields use `?`
- Nullable optional fields use `?: type | null`
- Enums as union type aliases
- No imports — entities have zero dependencies

---

### 2. Repository Interface — `business-core/application/repositories/[name].repository.ts`

```typescript
import type { [Name] } from 'business-core/domain/entities/[name].entity'

export interface GetById[Name]Input {
  id: string
}

export type GetById[Name]Response = [Name]
export type GetAll[Name]Response = [Name][]

export interface [Name]Repository {
  getById: (params: GetById[Name]Input) => Promise<GetById[Name]Response>
  getAll: () => Promise<GetAll[Name]Response>
  // add other methods as requested
}
```

Rules:
- Only imports from `domain`
- Input types as interfaces: `[Method][Entity]Input`
- Response types as type aliases: `[Method][Entity]Response`
- All methods return `Promise<T>`

---

### 3. Controller Schema — `business-core/presentation/controllers/[name]/[name].schema.ts`

```typescript
import * as z from 'zod'

export const [Name]Schema = z.object({
  id: z.string().min(8),
  name: z.string(),
  // map all entity fields with appropriate validation
})

export const GetById[Name]InputSchema = z.object({
  id: z.string().min(8),
})

// Add one schema per controller method input
```

Rules:
- Validates API inputs and shapes, not UI/form inputs
- Use `z.string().min(8)` for IDs (matches existing pattern)
- Field-level messages only where domain rules require them

---

## After Generating

Inform the user of next steps:
- Run `/create-controller` to generate the controller, factory, and hook
- Run `/create-unit-test` if tests should be added immediately
