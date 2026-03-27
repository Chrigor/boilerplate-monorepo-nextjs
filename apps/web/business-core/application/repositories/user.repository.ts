import type { User } from 'business-core/domain/entities/user.entity'

export interface GetUserByIdInput {
  id: string
}

export type GetUserByIdResponse = User

export type GetMeResponse = User

export interface UserRepository {
  getById: (params: GetUserByIdInput) => Promise<GetUserByIdResponse>
  getMe: () => Promise<GetMeResponse>
}
