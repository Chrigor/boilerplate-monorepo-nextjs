---
name: create-schema
description: Generate a Zod schema for controller input validation or UI form validation
---

# Skill: Create Schema

Before generating, read `/specs/_conventions.md` to determine where the schema belongs.

## Step 1 — Classify the Schema

→ Validation contexts: `specs/(frontend)/_conventions.md` — Validation Rules section

Ask the user (or infer from context): is this a **controller schema** (API input validation, co-located with controller) or a **form/UI schema** (user-facing messages, in `presentation/schemas/[domain]/`)?

---

## Pattern 1: Controller Input Schema

Located co-located with the controller.

```typescript
import * as z from 'zod'

// Full entity shape (for response validation if needed)
export const [Entity]Schema = z.object({
  id: z.string().min(8),
  name: z.string(),
  email: z.string(),
  role: z.string(),
  accountId: z.string().min(8),
  // optional fields
  avatar: z.string().optional(),
  isInternal: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

// One schema per controller method input
export const GetById[Entity]InputSchema = z.object({
  id: z.string().min(8),
})

export const Create[Entity]InputSchema = z.object({
  name: z.string().min(1),
  email: z.string(),
  // add required fields
})
```

Rules:
- IDs use `z.string().min(8)` (matches existing pattern)
- No user-facing error messages — these are API contract validations
- Named `[MethodName][Entity]InputSchema`

---

## Pattern 2: Form/UI Schema

Located at `business-core/presentation/schemas/[domain]/[name].schema.ts`

```typescript
import * as z from 'zod'

export const [Name]Schema = z.object({
  email: z.email({ error: 'E-mail inválido' }),
  password: z.string().min(6, { error: 'A senha deve ter no mínimo 6 caracteres' }),
  name: z.string().min(1, { error: 'Nome é obrigatório' }),
})

export type [Name]FormData = z.infer<typeof [Name]Schema>
```

Rules:
- Always export `z.infer<typeof [Name]Schema>` as a named type `[Name]FormData`
- User-facing error messages in Portuguese (matches existing project language)
- Named `[Name]Schema` (e.g., `LoginSchema`, `CreateProductSchema`)
- Used with `react-hook-form` + `zodResolver([Name]Schema)`

---

## Usage in a Form Component

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { [Name]Schema, type [Name]FormData } from 'business-core/presentation/schemas/[domain]/[name].schema'

const { register, handleSubmit, formState: { errors } } = useForm<[Name]FormData>({
  resolver: zodResolver([Name]Schema),
})
```

---

## Zod v4 Notes

This project uses **Zod v4** (`zod@^4.x`). Key differences from v3:
- `z.string().email()` → use `z.email()` directly
- Error messages use `{ error: '...' }` not `{ message: '...' }`
- Example: `z.email({ error: 'E-mail inválido' })`
