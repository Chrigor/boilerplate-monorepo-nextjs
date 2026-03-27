import { create } from 'zustand'
import type { User } from 'business-core/domain/entities/user.entity'

interface AuthState {
  user: User | null
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
