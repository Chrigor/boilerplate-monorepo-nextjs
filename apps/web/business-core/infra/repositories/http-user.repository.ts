import { User } from 'business-core/domain/entities/user.entity'
import { HttpClient } from '../client.http'
import { GetUserByIdInput, UserRepository } from 'business-core/application/repositories/user.repository'

export class HttpUserRepository implements UserRepository {
  constructor(private readonly http: HttpClient) {}
  async getById(input: GetUserByIdInput): Promise<User> {
    const response = await this.http.get<User>(`/users/${input.id}`)
    return response.data
  }

  async getMe(): Promise<User> {
    const response = await this.http.get<User>('/users/me')
    return response.data
  }
}
