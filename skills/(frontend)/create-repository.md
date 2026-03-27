---
name: create-repository
description: Generate the infra HTTP repository implementation for an entity
triggers:
  - create repository
  - add repository
  - new repository
  - http repository
requires:
  - /specs/_conventions.md
  - /docs/architecture.md
version: 1.0.0
---

# Skill: Create Repository

Before generating, read `/specs/_conventions.md` and the entity's repository interface at:
`business-core/application/repositories/[name].repository.ts`

If the interface doesn't exist, run `/create-spec` first.

---

## File to Generate

### `business-core/infra/repositories/http-[name].repository.ts`

```typescript
import type { [Name] } from 'business-core/domain/entities/[name].entity'
import type { HttpClient } from '../client.http'
import type {
  GetById[Name]Input,
  [Name]Repository,
} from 'business-core/application/repositories/[name].repository'

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

  async create(input: Create[Name]Input): Promise<[Name]> {
    const response = await this.http.post<[Name]>('/[names]', input)
    return response.data
  }

  async update(input: Update[Name]Input): Promise<[Name]> {
    const response = await this.http.put<[Name]>(`/[names]/${input.id}`, input)
    return response.data
  }

  async delete(input: GetById[Name]Input): Promise<void> {
    await this.http.delete(`/[names]/${input.id}`)
  }
}
```

Only include methods that exist in the repository interface. Do not add extra methods.

---

## Rules

- `implements [Name]Repository` — must satisfy every method in the interface
- HTTP methods map: `getById/getAll` → `http.get`, `create` → `http.post`, `update` → `http.put`/`http.patch`, `delete` → `http.delete`
- Always return `response.data` (HttpClient wraps in `{ data, status, statusText }`)
- URL convention: `/[entity-name-plural-kebab]` (e.g., `/users`, `/product-categories`)
- Constructor only accepts `HttpClient` — no other dependencies

---

## Spec File

Also create `http-[name].repository.spec.ts`:
```typescript
import { faker } from '@faker-js/faker'
import { Http[Name]Repository } from './http-[name].repository'
import type { HttpClient } from '../client.http'

const fake[Name] = { id: faker.string.uuid(), /* ...fields */ }

const mockHttp = {
  get: jest.fn().mockResolvedValue({ data: fake[Name] }),
  post: jest.fn().mockResolvedValue({ data: fake[Name] }),
} as unknown as HttpClient

describe('Http[Name]Repository', () => {
  const repo = new Http[Name]Repository(mockHttp)

  it('getById fetches from correct endpoint', async () => {
    const result = await repo.getById({ id: fake[Name].id })
    expect(mockHttp.get).toHaveBeenCalledWith(`/[names]/${fake[Name].id}`)
    expect(result).toEqual(fake[Name])
  })
})
```
