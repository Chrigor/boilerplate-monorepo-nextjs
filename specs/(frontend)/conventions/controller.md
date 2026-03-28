# Controller Pattern

```typescript
// 1. Schema (co-located)
export const GetEntityByIdInputSchema = z.object({ id: z.string().min(8) })

// 2. Controller
export class EntityController {
  constructor(private readonly entityRepository: EntityRepository) {}
  async getById(params: GetEntityByIdInput) {
    GetEntityByIdInputSchema.parse(params) // validate first
    return await this.entityRepository.getById(params)
  }
}

// 3. Factory
export function makeEntityController(): EntityController {
  const http = makeHttpClient()
  const repo = new HttpEntityRepository(http)
  return new EntityController(repo)
}

// 4. Hook
export function useEntityController(): EntityController {
  return makeEntityController()
}
```
