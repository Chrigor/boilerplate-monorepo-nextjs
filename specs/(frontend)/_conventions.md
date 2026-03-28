# Frontend Conventions

Quick-reference index. Open a sub-file only when you need the full rule for that topic.

---

## Structure

- [architecture.md](../../docs/(frontend)/architecture.md) — camadas, responsabilidades, data flow, direção de dependência e tecnologias
- [folder-structure.md](conventions/folder-structure.md) — onde cada tipo de arquivo vive dentro de `apps/web/`

## Naming & Validation

- [code-conventions.md](../../docs/(frontend)/code-conventions.md) — naming de arquivos, funções e variáveis; import order, export patterns, TypeScript patterns
- [validation.md](conventions/validation.md) — quando usar schema de controller vs schema de UI/form

## Patterns

- [factory.md](conventions/factory.md) — cadeia de composição `makeHttpClient → Repository → Controller → Hook`
- [controller.md](conventions/controller.md) — estrutura completa: schema co-localizado, classe, factory e hook
- [store.md](conventions/store.md) — Zustand global singleton vs provider-scoped (`createStore` + context)

## UI

- [components.md](conventions/components.md) — smart vs dumb, quando usar o composition pattern (`Card.Root`, `Card.Header`…)
- [images.md](conventions/images.md) — sempre `next/image`, nunca `<img>`
