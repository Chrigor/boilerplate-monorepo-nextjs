# Factory Pattern

1. `makeHttpClient()` — creates `HttpClient` with env-based config
2. `makeHttpUserRepository(http)` — not used directly
3. `make[Entity]Controller()` — composes: `HttpClient` → `Http[Entity]Repository` → `[Entity]Controller`
4. `use[Entity]Controller()` — React hook calling the factory (for component use)

```typescript
// Factory composition chain:
makeHttpClient() → new HttpUserRepository(http) → new UserController(repo)
```
