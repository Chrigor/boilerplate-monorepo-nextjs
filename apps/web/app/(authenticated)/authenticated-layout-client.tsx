'use client'

import { type ReactNode } from 'react'
import { useAuthStore } from 'features/providers/user-provider/stores/auth.store'
import { UserProvider } from 'features/providers/user-provider/user-provider'

export function AuthenticatedLayoutClient({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user) 

  if (!user) {
    return null
  }

  return <UserProvider user={user}>{children}</UserProvider>
}
