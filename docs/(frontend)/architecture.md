# Architecture

## Overview

This project follows **Clean Architecture** principles inside a Turborepo monorepo. The `apps/web` Next.js application is the primary app and contains all business logic organized in layers.

---

## Monorepo Structure

```
boilerplate-claude-nextjs/
  apps/web/          Next.js app (main application)
  packages/ui/       Shared React component library (Button, Collapsible)
  packages/eslint-config/    Shared ESLint config
  packages/typescript-config/ Shared TypeScript config
```

Package manager: **Bun**. Build orchestration: **Turbo**.

---

## Layer Responsibilities

### `business-core/domain/`
- Pure TypeScript interfaces and types
- Defines what entities look like (e.g., `User`)
- Zero dependencies — no imports from other layers

### `business-core/application/`
- Repository interfaces (contracts)
- Defines what operations exist without implementing them
- Depends only on `domain`

### `business-core/infra/`
- `HttpClient` class: generic fetch wrapper with auth, params, error handling
- `make-http-client.ts`: factory reading `process.env.API_BASE_URL`
- `repositories/`: concrete implementations of application interfaces (e.g., `HttpUserRepository`)
- Depends on `application` and `domain`

### `business-core/presentation/controllers/`
- One folder per entity (e.g., `controllers/user/`)
- Each folder contains: controller class, Zod input schema, factory function
- Controller validates inputs before delegating to repositories
- Depends on `application`

### `business-core/presentation/hooks/`
- React hooks that instantiate controllers via factories
- Bridge between React components and the controller layer
- Example: `useUserController()` calls `makeUserController()`

### `business-core/presentation/schemas/`
- Zod schemas for UI/form validation
- Separate from controller schemas (different validation concerns)
- Used with `react-hook-form` + `zodResolver`

### `features/`
- Smart components consuming stores and controller hooks
- Route-specific UI organized by domain feature
- `providers/`: Zustand store providers (global auth store + provider-scoped user store)
- Each feature: `features/[feature]/components/`

### `shared/`
- `components/`: Reusable dumb UI components (no business logic)
- `hooks/`: Utility React hooks (no business logic)

### `app/` (Next.js routing)
- Route groups: `(authenticated)/` and `(unauthenticated)/`
- Layouts handle auth guard via Zustand auth store
- Pages are thin — delegate to feature components

---

## Data Flow

```
User Interaction
      │
      ▼
 Page / Feature Component   (features/ or app/)
      │
      ├─ reads from ──────► Zustand Store   (features/providers/)
      │
      └─ calls ───────────► useEntityController()   (presentation/hooks/)
                                  │
                                  ▼
                            EntityController   (presentation/controllers/)
                                  │ validates input via Zod schema
                                  ▼
                            EntityRepository interface   (application/)
                                  │ implemented by
                                  ▼
                            HttpEntityRepository   (infra/repositories/)
                                  │
                                  ▼
                            HttpClient   (infra/client.http.ts)
                                  │
                                  ▼
                            External API
```

---

## Dependency Direction Rules

- `domain` ← imports nothing from this project
- `application` ← imports only from `domain`
- `infra` ← imports from `application` and `domain`
- `presentation/controllers` ← imports from `application`
- `presentation/hooks` ← imports from `presentation/controllers`
- `features` ← imports from `presentation`, `domain`, and `shared`
- `shared` ← imports only from `@repo/ui` and React; never from `features` or `business-core`
- `app/` ← imports from `features` and `shared`

**Never import upward or sideways across domains without going through the proper layer.**

---

## Key Technologies

| Concern | Technology |
|---------|-----------|
| Framework | Next.js 16.2 (App Router) |
| Language | TypeScript 5.9 (strict mode) |
| Styling | Tailwind CSS v4 |
| State | Zustand v5 |
| Forms | React Hook Form + Zod v4 |
| HTTP | Custom `HttpClient` (fetch-based) |
| Testing | Bun test + Testing Library + happy-dom |
| UI primitives | Radix UI (via `@repo/ui`) |
