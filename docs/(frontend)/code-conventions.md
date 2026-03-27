# Code Conventions

## File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Entity | `[name].entity.ts` | `user.entity.ts` |
| Repository interface | `[name].repository.ts` | `user.repository.ts` |
| Infra repository | `http-[name].repository.ts` | `http-user.repository.ts` |
| HTTP client | `client.http.ts` | `client.http.ts` |
| Factory | `make-[name].ts` | `make-http-client.ts`, `make-user-controller.ts` |
| Controller | `[name].controller.ts` | `user.controller.ts` |
| Controller schema | `[name].schema.ts` (in controller folder) | `user.schema.ts` |
| UI schema | `[name].schema.ts` (in `schemas/[domain]/`) | `login.schema.ts` |
| Hook | `use-[name].ts` | `use-user-controller.ts`, `use-count.ts` |
| Provider | `[name]-provider.tsx` | `user-provider.tsx` |
| Store | `[name].store.ts` | `auth.store.ts`, `user.store.ts` |
| Store context | `[name]-store.context.ts` | `user-store.context.ts` |
| Component | `[name].tsx` | `login-form.tsx`, `card-root.tsx` |
| Spec | `[file].spec.ts(x)` | `user.controller.spec.ts`, `login-form.spec.tsx` |
| Component folder index | `index.tsx` | `shared/components/card/index.tsx` |

All file names use **kebab-case**.

---

## Function Naming

| Type | Convention | Example |
|------|-----------|---------|
| React component | `PascalCase` | `function CardRoot(...)`, `function LoginForm(...)` |
| Class | `PascalCase` | `class HttpClient`, `class UserController` |
| Factory function | `make[Entity][Type]()` | `makeUserController()`, `makeHttpClient()` |
| Hook | `use[Name]` | `useUserController()`, `useAuthStore()`, `useCount()` |
| Store creator | `create[Name]Store()` | `createUserStore()` |
| Regular functions | `camelCase` | `buildURL()`, `parseResponse()` |

---

## Variable Naming

| Type | Convention | Example |
|------|-----------|---------|
| Variables | `camelCase` | `const storeRef`, `const httpUserRepository` |
| Constants (module-level) | `UPPER_SNAKE_CASE` | `MOCK_USER` |
| TypeScript interfaces | `PascalCase` | `interface UserRepository`, `interface HttpConfig` |
| TypeScript types | `PascalCase` | `type UserRole`, `type LoginFormData` |
| Zod schemas | `[Name]Schema` | `LoginSchema`, `GetUserByIdInputSchema`, `UserSchema` |
| Inferred Zod types | `z.infer<typeof [Name]Schema>` → export as `PascalCase` | `export type LoginFormData = z.infer<typeof LoginSchema>` |
| Props types | `[ComponentName]Props` | `type EventCardProps`, `interface LoginFormProps` |

---

## Import Ordering

Imports are grouped (no blank lines observed between groups in practice):
1. External packages (`react`, `next/*`, `zustand`, `zod`, `@repo/ui`)
2. Internal absolute paths (`business-core/...`, `features/...`, `shared/...`)

No relative path imports — the project uses **absolute paths via `tsconfig baseUrl: "."`**.

```typescript
// External
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
// Internal absolute
import { LoginSchema, type LoginFormData } from 'business-core/presentation/schemas/login/login.schema'
import { Button } from '@repo/ui'
```

---

## Export Patterns

| Pattern | Used for |
|---------|---------|
| Named export `export function` | All components, hooks, factories, controllers |
| Named export `export class` | `HttpClient`, `UserController`, `HttpUserRepository` |
| Named export `export interface` | Repository interfaces, type definitions |
| Named export `export const` | Zustand stores (`useAuthStore`), Zod schemas, composition objects (`Card`) |
| Default export | Next.js pages and layouts only (`export default function PageName`) |
| Re-export barrel | `packages/ui/src/index.ts` — the UI package barrel |

No `export default` on components, hooks, classes, or utilities — always named exports.

---

## TypeScript Patterns

- Strict mode enabled (`strict: true`, `strictNullChecks: true`, `noUncheckedIndexedAccess: true`)
- Props typed with `type` keyword for component props objects
- `interface` used for repository contracts and HTTP interfaces
- `ComponentProps<'element'>` used to extend native HTML element props for dumb components
- `React.ComponentProps<typeof PrimitiveComponent>` used for Radix UI wrappers
