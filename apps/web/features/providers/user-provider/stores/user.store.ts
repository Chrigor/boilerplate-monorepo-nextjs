import { createStore } from 'zustand'
import type { User } from 'business-core/domain/entities/user.entity'

export interface UserState {
  user: User
}

export type UserStore = ReturnType<typeof createUserStore>

export function createUserStore(initialUser: User) {
  return createStore<UserState>()(() => ({
    user: initialUser,
  }))
}
