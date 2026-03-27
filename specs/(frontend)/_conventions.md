# Project Conventions

## Architecture Layers

| Layer | Path | Responsibility |
|-------|------|----------------|
| Domain | `business-core/domain/entities/` | Pure data types (interfaces/types). No dependencies. |
| Application | `business-core/application/repositories/` | Repository interfaces. Depends only on domain. |
| Infrastructure | `business-core/infra/` | HTTP client, concrete repository implementations. Depends on application. |
| Presentation/Controllers | `business-core/presentation/controllers/[entity]/` | Controller class + Zod schema + factory. Depends on application repositories. |
| Presentation/Hooks | `business-core/presentation/hooks/` | React hooks that wrap controllers. Depends on presentation controllers. |
| Presentation/Schemas | `business-core/presentation/schemas/` | UI/form Zod schemas. UI-only validation. |
| Features | `features/[feature]/` | Smart components, providers, stores. Consumes presentation layer. |
| Shared | `shared/components/` and `shared/hooks/` | Reusable dumb components and utility hooks. No business logic. |

Dependency direction: `shared` ← `features` ← `presentation` ← `infra` ← `application` ← `domain`

---

## Folder Structure Conventions

```
apps/web/
  business-core/
    domain/entities/              [entity].entity.ts
    application/repositories/     [entity].repository.ts
    infra/                        client.http.ts · make-http-client.ts
    infra/repositories/           http-[entity].repository.ts
    presentation/
      controllers/[entity]/       [entity].controller.ts
                                  make-[entity]-controller.ts
                                  [entity].schema.ts
      hooks/                      use-[entity]-controller.ts
      schemas/[domain]/           [name].schema.ts
  features/
    [feature]/components/         [component-name].tsx
    providers/[name]/             [name]-provider.tsx
    providers/[name]/stores/      [name].store.ts · [name]-store.context.ts
  shared/
    components/[name]/            index.tsx (+ sub-components for composition)
    hooks/                        use-[name].ts
  app/
    (authenticated)/              route group, layout.tsx
    (unauthenticated)/            route group
```

---

## Naming Conventions

### Files
- All files: `kebab-case`
- Entities: `[name].entity.ts`
- Repository interfaces: `[name].repository.ts`
- Infra repositories: `http-[name].repository.ts`
- Controllers: `[name].controller.ts`
- Controller factories: `make-[name]-controller.ts`
- Controller schemas: `[name].schema.ts` (co-located in controller folder)
- Hooks: `use-[name].ts` or `use-[name]-controller.ts`
- Specs: `[file].spec.ts` or `[file].spec.tsx` (co-located)
- Providers: `[name]-provider.tsx`
- Stores: `[name].store.ts`, `[name]-store.context.ts`

### Functions and Classes
- Components: `PascalCase` named exports (e.g., `export function CardRoot`)
- Classes: `PascalCase` (e.g., `HttpClient`, `UserController`)
- Factory functions: `make[Entity][Type]()` (e.g., `makeUserController`)
- Hooks: `use[Name]` (e.g., `useUserController`, `useAuthStore`)
- Store creators: `create[Name]Store` (e.g., `createUserStore`)

### Variables and Types
- Variables/props: `camelCase`
- Types/interfaces: `PascalCase`
- Zod schemas: `[Name]Schema` (e.g., `LoginSchema`, `GetUserByIdInputSchema`)
- Inferred types from zod: `z.infer<typeof [Name]Schema>` (e.g., `LoginFormData`)

---

## Validation Rules

| Context | Location | Purpose |
|---------|----------|---------|
| Controller input | `presentation/controllers/[entity]/[entity].schema.ts` | Validates API inputs (e.g., `GetUserByIdInputSchema`) |
| UI/Form | `presentation/schemas/[domain]/[name].schema.ts` | Validates form fields with user-facing messages |

---

## Factory Pattern

1. `makeHttpClient()` — creates `HttpClient` with env-based config
2. `makeHttpUserRepository(http)` — not used directly
3. `make[Entity]Controller()` — composes: `HttpClient` → `Http[Entity]Repository` → `[Entity]Controller`
4. `use[Entity]Controller()` — React hook calling the factory (for component use)

```typescript
// Factory composition chain:
makeHttpClient() → new HttpUserRepository(http) → new UserController(repo)
```

---

## Component Classification

### Smart (in `features/`)
- Reads from Zustand stores or calls controller hooks
- Has side effects (navigation, state mutations)
- Examples: `UserProfileCard`, `LoginForm`

### Dumb (in `shared/components/`)
- Accepts only props
- No store access, no hooks beyond React primitives
- May use composition pattern (Root/Header/Title/etc.)
- Examples: `Card.*`, `EventCard`

### Composition Pattern (for shared components)
When a component has multiple structural parts, export as a namespace object:
```typescript
export const Card = { Root, Image, Content, Header, Title, Description }
// Usage: <Card.Root><Card.Header>...</Card.Header></Card.Root>
```

---

## Controller Pattern

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

---

## Store Pattern (Zustand)

→ Full patterns and selector usage: [state-management.md](docs/(frontend)/state-management.md)

Two types:
- **Global singleton** (`create`) — app-wide state, used without a provider (e.g., `useAuthStore`)
- **Provider-scoped** (`createStore` + context) — state scoped to a layout subtree (e.g., `useUserStore` inside `UserProvider`)
