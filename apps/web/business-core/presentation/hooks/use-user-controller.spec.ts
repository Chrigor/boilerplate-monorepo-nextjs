import { useUserController } from './use-user-controller'
import { UserController } from '../controllers/user/user.controller'

describe('useUserController', () => {
  it('should return a UserController instance', () => {
    const controller = useUserController()

    expect(controller).toBeInstanceOf(UserController)
  })

  it('should expose a getById method', () => {
    const controller = useUserController()

    expect(typeof controller.getById).toBe('function')
  })
})
