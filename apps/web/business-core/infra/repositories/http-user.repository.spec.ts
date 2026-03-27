import { faker } from '@faker-js/faker'
import { HttpUserRepository } from './http-user.repository'
import { HttpClient } from '../client.http'
import type { User } from 'business-core/domain/entities/user.entity'

const mockUser: User = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  role: faker.helpers.arrayElement(['ADMIN', 'VIWER'] as const),
  accountId: faker.string.uuid(),
}

type GetSpy = { calls: string[]; resolveWith: unknown; rejectWith?: Error }

function createMockHttpClient() {
  const spy: GetSpy = { calls: [], resolveWith: null }
  const client = {
    get: async (url: string) => {
      spy.calls.push(url)
      if (spy.rejectWith) throw spy.rejectWith
      return spy.resolveWith
    },
  } as unknown as HttpClient
  return { client, spy }
}

describe('HttpUserRepository', () => {
  let spy: GetSpy
  let repository: HttpUserRepository

  beforeEach(() => {
    const mock = createMockHttpClient()
    spy = mock.spy
    repository = new HttpUserRepository(mock.client)
  })

  describe('getMe', () => {
    it('should call http.get with the correct endpoint', async () => {
      spy.resolveWith = { data: mockUser, status: 200, statusText: 'OK' }

      await repository.getMe()

      expect(spy.calls).toContain('/users/me')
    })

    it('should return the user data from the response', async () => {
      spy.resolveWith = { data: mockUser, status: 200, statusText: 'OK' }

      const result = await repository.getMe()

      expect(result).toEqual(mockUser)
    })

    it('should propagate http errors', async () => {
      spy.rejectWith = new Error('Unauthorized')

      await expect(repository.getMe()).rejects.toThrow('Unauthorized')
    })
  })

  describe('getById', () => {
    it('should call http.get with the correct endpoint', async () => {
      spy.resolveWith = { data: mockUser, status: 200, statusText: 'OK' }

      await repository.getById({ id: 'user-1' })

      expect(spy.calls).toContain('/users/user-1')
    })

    it('should return the user data from the response', async () => {
      spy.resolveWith = { data: mockUser, status: 200, statusText: 'OK' }

      const result = await repository.getById({ id: 'user-1' })

      expect(result).toEqual(mockUser)
    })

    it('should propagate http errors', async () => {
      spy.rejectWith = new Error('Not Found')

      await expect(repository.getById({ id: 'invalid-id' })).rejects.toThrow('Not Found')
    })
  })
})
