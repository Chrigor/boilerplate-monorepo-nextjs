import * as makeHttpClientModule from 'business-core/infra/make-http-client'
import { UserController } from './user.controller'
import { makeUserController } from './make-user-controller'

describe('makeUserController', () => {
  it('should return an instance of UserController', () => {
    const controller = makeUserController()

    expect(controller).toBeInstanceOf(UserController)
  })

  it('should call makeHttpClient to build the http client', () => {
    const makeHttpClientSpy = jest.spyOn(makeHttpClientModule, 'makeHttpClient')

    makeUserController()

    expect(makeHttpClientSpy).toHaveBeenCalledTimes(1)

    makeHttpClientSpy.mockRestore()
  })
})
