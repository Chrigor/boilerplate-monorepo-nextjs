# Conventional Commits

## Format

```
<type>(<scope>): <description>
```

All lowercase. Imperative mood. No period at the end.

---

## Types Used in This Project

| Type | When to use |
|------|------------|
| `feat` | New feature or component |
| `refactor` | Code restructure without behavior change |
| `test` | Adding or updating tests |
| `chore` | Dependency additions, config changes, tooling |
| `fix` | Bug fixes (not yet in history but expected) |

---

## Scope Conventions

Scopes map to the package or architectural area being changed.

| Scope | Maps to |
|-------|---------|
| `web` | `apps/web` — general Next.js app changes |
| `business-core` | `apps/web/business-core/` — any layer within business-core |
| `ui` | `packages/ui/` — shared UI component library |
| `layout-authenticated` | `apps/web/app/(authenticated)/` — authenticated layout |

**Rule:** Use the most specific scope that accurately describes the affected area. Prefer feature/domain names over generic `web` when the change is isolated to one feature.

---

## Real Examples From This Project

```
feat(web): add EventCard component consuming Card composition
feat(web): add Card component with composition pattern
feat(web): add useCount hook with increment, decrement and reset
feat(web): set mock user on login submit and redirect to user-profile
feat(web): consume user from zustand in UserProfileCard
feat(web): add global auth store and client-side authenticated layout
feat(web): add UserProvider with zustand store
feat(web): add user profile page with SSR and error boundary
feat(web): extract LoginForm component and add tests
feat(web): implement login form with react-hook-form and zod validation
feat(business-core): add getMe to user module
feat(business-core): add login schema with zod validation

refactor(web): rename features/user-profile to features/user
refactor(web): split routes into (authenticated) and (unauthenticated) groups
refactor(web): move LoginForm from app/features to features
refactor(layout-authenticated): remove unecessary disacoplament
refactor(business-core): extract makeHttpClient factory and add tests
refactor(business-core): extract makeUserController factory

test(ui): rename utils test description to be more descriptive

chore(web): add react-hook-form, hookform resolvers and @repo/ui path alias
```

---

## Guidelines

- A commit that adds a component AND its test uses `feat`, not `test`
- A commit that only adds/modifies tests uses `test`
- Factory extractions are `refactor` (no behavior change)
- Renaming folders/files is `refactor`
- Adding new packages to `package.json` is `chore`
