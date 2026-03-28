# Folder Structure Conventions

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
