---
name: create-controller
description: Generate controller, infra repository, factory, and hook for an entity
triggers:
  - create controller
  - add controller
  - new controller
  - generate controller
requires:
  - /specs/_conventions.md
  - /docs/architecture.md
version: 1.0.0
---

# Skill: Create Controller

Before generating, read `/specs/_conventions.md` and the entity's files in:
- `business-core/domain/entities/[name].entity.ts`
- `business-core/application/repositories/[name].repository.ts`
- `business-core/presentation/controllers/[name]/[name].schema.ts` (if exists)

If those files don't exist, run `/create-spec` first.

---

## Files to Generate

### 1. Controller — `business-core/presentation/controllers/[name]/[name].controller.ts`

```typescript
import type { GetById[Name]Input, [Name]Repository } from 'business-core/application/repositories/[name].repository'
import { GetById[Name]InputSchema } from './[name].schema'

export class [Name]Controller {
  constructor(private readonly [name]Repository: [Name]Repository) {}

  async getById(params: GetById[Name]Input) {
    GetById[Name]InputSchema.parse(params)
    return await this.[name]Repository.getById(params)
  }

  async getAll() {
    return await this.[name]Repository.getAll()
  }
}
```

Rules:
- Validate inputs with Zod schema (`.parse()`) before delegating
- One method per repository operation
- Constructor receives repository interface (not concrete class)
- No direct HTTP calls

---

### 2. Schema — `business-core/presentation/controllers/[name]/[name].schema.ts`

(Generate if not already created by `/create-spec`)

```typescript
import * as z from 'zod'

export const GetById[Name]InputSchema = z.object({
  id: z.string().min(8),
})
```

---

### 3. Infra Repository — `business-core/infra/repositories/http-[name].repository.ts`

```typescript
import type { [Name] } from 'business-core/domain/entities/[name].entity'
import type { HttpClient } from '../client.http'
import type { GetById[Name]Input, [Name]Repository } from 'business-core/application/repositories/[name].repository'

export class Http[Name]Repository implements [Name]Repository {
  constructor(private readonly http: HttpClient) {}

  async getById(input: GetById[Name]Input): Promise<[Name]> {
    const response = await this.http.get<[Name]>(`/[names]/${input.id}`)
    return response.data
  }

  async getAll(): Promise<[Name][]> {
    const response = await this.http.get<[Name][]>('/[names]')
    return response.data
  }
}
```

→ Repository rules: [create-repository.md — Rules](skills/(frontend)/create-repository.md#rules)

---

### 4. Factory — `business-core/presentation/controllers/[name]/make-[name]-controller.ts`

```typescript
import { makeHttpClient } from 'business-core/infra/make-http-client'
import { Http[Name]Repository } from 'business-core/infra/repositories/http-[name].repository'
import { [Name]Controller } from './[name].controller'

export function make[Name]Controller(): [Name]Controller {
  const http = makeHttpClient()
  const http[Name]Repository = new Http[Name]Repository(http)
  return new [Name]Controller(http[Name]Repository)
}
```

---

### 5. Hook — `business-core/presentation/hooks/use-[name]-controller.ts`

```typescript
import { make[Name]Controller } from '../controllers/[name]/make-[name]-controller'
import type { [Name]Controller } from '../controllers/[name]/[name].controller'

export function use[Name]Controller(): [Name]Controller {
  return make[Name]Controller()
}
```

---

## After Generating

Inform the user:
- Use `use[Name]Controller()` in smart components to call controller methods
- Run `/create-unit-test` to generate tests for the new controller
