# Store Pattern (Zustand)

→ Full patterns and selector usage: [state-management.md](docs/(frontend)/state-management.md)

Two types:
- **Global singleton** (`create`) — app-wide state, used without a provider (e.g., `useAuthStore`)
- **Provider-scoped** (`createStore` + context) — state scoped to a layout subtree (e.g., `useUserStore` inside `UserProvider`)
