'use client'

import { useRef, type ReactNode } from 'react'
import type { User } from 'business-core/domain/entities/user.entity'
import { createUserStore } from './stores/user.store'
import { UserStoreContext } from './stores/user-store.context'

interface UserProviderProps {
  user: User
  children: ReactNode
}

export function UserProvider({ user, children }: UserProviderProps) {
  const storeRef = useRef<ReturnType<typeof createUserStore>>(null)

  if (!storeRef.current) {
    storeRef.current = createUserStore(user)
  }

  return (
    <UserStoreContext.Provider value={storeRef.current}>
      {children}
    </UserStoreContext.Provider>
  )
}
