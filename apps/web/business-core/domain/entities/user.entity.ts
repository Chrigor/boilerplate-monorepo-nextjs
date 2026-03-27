type UserRole = 'ADMIN' | 'VIWER'

type UserPermission = Map<string, boolean>

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  accountId: string
  avatar?: string | null
  permissions?: UserPermission | null
  isInternal?: boolean
  createdAt?: string
  updatedAt?: string
}