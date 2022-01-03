import { MissinParamError } from '../errors/missing-param-error'
import { SignupController } from './signupController'

const makeSut = (): SignupController => {
  return new SignupController()
}

describe('signup controller', () => {
  it('should return status 400 if no name is provided', () => {
    const sut = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@any.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamError('name'))
  })

  it('should return status 400 if no email is provided', () => {
    const sut = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamError('email'))
  })

  it('should return status 400 if no password is provided', () => {
    const sut = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@any.com',
        name: 'any_name',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamError('password'))
  })

  it('should return status 400 if no passwordConfirmation is provided', () => {
    const sut = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@any.com',
        name: 'any_name',
        password: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamError('passwordConfirmation'))
  })
})
