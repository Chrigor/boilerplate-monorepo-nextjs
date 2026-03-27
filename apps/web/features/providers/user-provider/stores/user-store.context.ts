import { useStore } from 'zustand'
import { createContext, useContext } from 'react'
import type { UserStore, UserState } from './user.store'

export const UserStoreContext = createContext<UserStore | null>(null)

export function useUserStore<T>(selector: (state: UserState) => T): T {
  const store = useContext(UserStoreContext)
  if (!store) throw new Error('useUserStore must be used within UserProvider')
  return useStore(store, selector)
}
