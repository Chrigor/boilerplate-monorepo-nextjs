# State Management

## Approach

**Zustand v5** with two distinct store patterns depending on scope.

---

## Pattern 1: Global Singleton Store

Used for application-wide state that exists outside any React tree.

```typescript
export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
```

- Created with `create()` from `zustand`
- Returns a hook directly (e.g., `useAuthStore`)
- Used anywhere without a provider
- Current use: authentication state (`user: User | null`)

---

## Pattern 2: Provider-Scoped Store

Used when state should be scoped to a subtree (e.g., the authenticated section).

```typescript
export function createUserStore(initialUser: User) {
  return createStore<UserState>()(() => ({ user: initialUser }))
}

export const UserStoreContext = createContext<UserStore | null>(null)

export function useUserStore<T>(selector: (state: UserState) => T): T {
  const store = useContext(UserStoreContext)
  if (!store) throw new Error('useUserStore must be used within UserProvider')
  return useStore(store, selector)
}

export function UserProvider({ user, children }: UserProviderProps) {
  const storeRef = useRef<ReturnType<typeof createUserStore>>(null)
  if (!storeRef.current) storeRef.current = createUserStore(user)
  return <UserStoreContext.Provider value={storeRef.current}>{children}</UserStoreContext.Provider>
}
```

- Created with `createStore()` from `zustand` (not `create()`)
- Store instance held in `useRef` to avoid recreation on re-renders
- Exposed via React Context
- Consumed via a custom `useUserStore(selector)` hook
- Must be wrapped with `<UserProvider user={...}>` to use `useUserStore`

---

## When to Use Each Pattern

| Pattern | When |
|---------|------|
| Global singleton (`create`) | State needed outside React tree, or truly global (auth, theme, notifications) |
| Provider-scoped (`createStore` + context) | State initialized from server/parent data, scoped to a layout section |

---

## Selector Pattern

Both patterns use selector functions to subscribe to specific slices:
```typescript
const user = useAuthStore((state) => state.user)
const user = useUserStore((state) => state.user)
```

This prevents unnecessary re-renders — the component only re-renders when the selected slice changes.
