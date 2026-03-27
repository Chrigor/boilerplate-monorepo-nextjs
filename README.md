# boilerplate-claude-nextjs

Turborepo monorepo with a Next.js app following Clean Architecture.

## Structure

```
apps/web/          Next.js 16 (App Router) — main application
packages/ui/       Shared React component library (Radix UI primitives)
packages/eslint-config/
packages/typescript-config/
```

Package manager: **Bun**. Build orchestration: **Turbo**.

## Architecture

`apps/web` follows Clean Architecture with strict layer boundaries:

```
Domain → Application → Infra → Presentation → Features → UI
```

| Layer | Path | Responsibility |
|---|---|---|
| Domain | `business-core/domain/` | Entities and types, zero deps |
| Application | `business-core/application/` | Repository interfaces (contracts) |
| Infra | `business-core/infra/` | `HttpClient` + concrete repository implementations |
| Controllers | `business-core/presentation/controllers/` | Input validation (Zod) + repository delegation |
| Hooks | `business-core/presentation/hooks/` | React bridge to controllers via factories |
| Schemas | `business-core/presentation/schemas/` | Zod schemas for forms/UI |
| Features | `features/` | Smart components consuming stores and controller hooks |
| Shared | `shared/` | Dumb components and utility hooks (no business logic) |
| Routing | `app/` | Thin pages + auth-guarded route groups |

## Key Decisions

- **No `export default`** except Next.js pages/layouts
- **No relative imports** — absolute paths via `tsconfig baseUrl: "."`
- **`shared/`** never imports from `features/` or `business-core/`
- **Dumb components** are props-only — no Zustand access
- **Controllers** always validate with Zod `.parse()` before calling repos
- **Styling** is Tailwind CSS v4 only — no CSS modules, no CSS-in-JS
- **Tests** use Bun test + Testing Library + `@faker-js/faker`

## Tech Stack

| Concern | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| Language | TypeScript 5.9 (strict) |
| Styling | Tailwind CSS v4 |
| State | Zustand v5 |
| Forms | React Hook Form + Zod v4 |
| HTTP | Custom `HttpClient` (fetch-based) |
| Testing | Bun test + Testing Library + happy-dom |
| UI primitives | Radix UI (via `@repo/ui`) |

## Commands

```bash
bun dev              # start dev server
bun test             # run all tests
bun run lint         # lint
bun run check-types  # type check
turbo build          # build all packages
```
