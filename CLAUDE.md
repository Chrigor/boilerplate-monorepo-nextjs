# Project

Turborepo monorepo with a Next.js 16 app (`apps/web`) and a shared UI package (`packages/ui`).
The web app follows Clean Architecture: Domain → Application → Infrastructure → Presentation → Features → UI.

---

## Frontend

### Architecture
→ [/docs/(frontend)/architecture.md](/docs/(frontend)/architecture.md)

### Conventions
→ [/specs/(frontend)/_conventions.md](/specs/(frontend)/_conventions.md)

### Components
→ [/specs/(frontend)/conventions/components.md](/specs/(frontend)/conventions/components.md)

### Docs
→ [/docs/(frontend)/code-conventions.md](/docs/(frontend)/code-conventions.md)
→ [/docs/(frontend)/style-guide.md](/docs/(frontend)/style-guide.md)
→ [/docs/(frontend)/conventional-commits.md](/docs/(frontend)/conventional-commits.md)
→ [/docs/(frontend)/testing-strategy.md](/docs/(frontend)/testing-strategy.md)
→ [/docs/(frontend)/state-management.md](/docs/(frontend)/state-management.md)
→ [/docs/(frontend)/error-handling.md](/docs/(frontend)/error-handling.md)
→ [/docs/(frontend)/api-contracts.md](/docs/(frontend)/api-contracts.md)

### Skills — read the relevant skill before any frontend task
→ `.claude/skills/create-component/SKILL.md` — new React component (smart or dumb)
→ `.claude/skills/create-spec/SKILL.md` — new domain entity + repository interface
→ `.claude/skills/create-controller/SKILL.md` — controller + infra repo + factory + hook
→ `.claude/skills/create-repository/SKILL.md` — infra HTTP repository only
→ `.claude/skills/create-hook/SKILL.md` — custom React hook
→ `.claude/skills/create-schema/SKILL.md` — Zod schema (controller input or form/UI)
→ `.claude/skills/create-unit-test/SKILL.md` — unit tests for any layer
→ `.claude/skills/domain-analysis/SKILL.md` — map layers affected by a new feature
→ `.claude/skills/refactor/SKILL.md` — check and fix convention violations

---

## Quick Reference

### File locations (frontend)
- Entity: `business-core/domain/entities/[name].entity.ts`
- Repository interface: `business-core/application/repositories/[name].repository.ts`
- HTTP repository: `business-core/infra/repositories/http-[name].repository.ts`
- Controller folder: `business-core/presentation/controllers/[name]/`
- Controller hook: `business-core/presentation/hooks/use-[name]-controller.ts`
- Form schema: `business-core/presentation/schemas/[domain]/[name].schema.ts`
- Smart component: `features/[feature]/components/[name]/index.tsx`
- Dumb component: `shared/components/[name]/index.tsx`
- Utility hook: `shared/hooks/use-[name].ts`
- Spec: co-located with source file, `[file].spec.ts(x)`

### Critical rules
- **No `export default`** except Next.js pages and layouts
- **No relative imports** — use absolute paths via `tsconfig baseUrl: "."`
- **`shared/`** must never import from `features/` or `business-core/`
- **Dumb components** must not access Zustand stores — props only
- **Controllers** must validate input with Zod `.parse()` before calling repositories
- **Factories** compose: `makeHttpClient()` → `new Http[Entity]Repository` → `new [Entity]Controller`
- **Styling** is Tailwind only — no CSS modules, no CSS-in-JS
- **Tests** use Bun test + Testing Library + `@faker-js/faker` for all test data
- **`useUserStore`** only works inside `<UserProvider>` — throws otherwise

### Commit format
```
<type>(<scope>): <description>
```
Types: `feat`, `refactor`, `test`, `chore`, `fix`
Scopes: `web`, `business-core`, `ui`, or specific area (e.g., `layout-authenticated`)

### Run commands
```bash
bun dev          # start dev server
bun test         # run all tests
bun run lint     # lint
bun run check-types  # type check
```
