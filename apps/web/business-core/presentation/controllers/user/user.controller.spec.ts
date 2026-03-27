import { faker } from '@faker-js/faker'
import { UserController } from './user.controller'
import type { User } from 'business-core/domain/entities/user.entity'
import type { UserRepository } from 'business-core/application/repositories/user.repository'

const mockUser: User = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  role: faker.helpers.arrayElement(['ADMIN', 'VIWER'] as const),
  accountId: faker.string.uuid(),
}

type RepositorySpy = { calls: string[]; resolveWith: User; rejectWith?: Error }

function createMockUserRepository() {
  const spy: RepositorySpy = { calls: [], resolveWith: mockUser }
  const repository = {
    getById: async ({ id }: { id: string }) => {
      spy.calls.push(id)
      if (spy.rejectWith) throw spy.rejectWith
      return spy.resolveWith
    },
    getMe: async () => {
      spy.calls.push('getMe')
      if (spy.rejectWith) throw spy.rejectWith
      return spy.resolveWith
    },
  } as unknown as UserRepository
  return { repository, spy }
}

describe('UserController', () => {
  let spy: RepositorySpy
  let controller: UserController

  beforeEach(() => {
    const mock = createMockUserRepository()
    spy = mock.spy
    controller = new UserController(mock.repository)
  })

  describe('getMe', () => {
    it('should call repository.getMe', async () => {
      await controller.getMe()

      expect(spy.calls).toContain('getMe')
    })

    it('should return the user from the repository', async () => {
      const result = await controller.getMe()

      expect(result).toEqual(mockUser)
    })

    it('should propagate repository errors', async () => {
      spy.rejectWith = new Error('Unauthorized')

      await expect(controller.getMe()).rejects.toThrow('Unauthorized')
    })
  })

  describe('getById', () => {
    it('should call repository.getById with the provided id', async () => {
      await controller.getById({ id: mockUser.id })

      expect(spy.calls).toContain(mockUser.id)
    })

    it('should return the user from the repository', async () => {
      const result = await controller.getById({ id: mockUser.id })

      expect(result).toEqual(mockUser)
    })

    it('should propagate repository errors', async () => {
      spy.rejectWith = new Error('User not found')

      await expect(controller.getById({ id: mockUser.id })).rejects.toThrow('User not found')
    })

    it('should throw a validation error when id has less than 8 characters', async () => {
      await expect(controller.getById({ id: 'short' })).rejects.toThrow()

      expect(spy.calls).toHaveLength(0)
    })

    it('should throw a validation error when id is empty', async () => {
      await expect(controller.getById({ id: '' })).rejects.toThrow()

      expect(spy.calls).toHaveLength(0)
    })
  })
})
