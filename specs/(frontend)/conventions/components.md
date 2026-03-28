# Component Classification

## Smart (in `features/`)
- Reads from Zustand stores or calls controller hooks
- Has side effects (navigation, state mutations)
- Not reusable across contexts — tightly coupled to one domain feature
- Examples: `UserProfileCard`, `LoginForm`

## Dumb (in `shared/components/`)
- Accepts only props
- No store access, no hooks beyond React primitives
- May use `useState`/`useRef` for local UI state only (e.g., open/closed)
- May use composition pattern (Root/Header/Title/etc.)
- Examples: `Card.*`, `EventCard`

## UI Package (`packages/ui`)
- Mesmas restrições dos Dumb components (só props, sem stores, sem hooks além de primitivos React)
- Sem dependências de nenhum app — não pode importar de `apps/`, `features/`, `shared/` ou `business-core/`
- Exportados via `packages/ui/src/index.ts`
- Use quando o componente precisa ser consumido por mais de um app no monorepo
- Se o componente só faz sentido em `apps/web`, use `shared/components/` em vez disso
- Examples: `Button`, `Input`, `Modal`

## Composition Pattern (for shared components)
When a component has multiple structural parts, export as a namespace object:
```typescript
export const Card = { Root, Image, Content, Header, Title, Description }
// Usage: <Card.Root><Card.Header>...</Card.Header></Card.Root>
```
