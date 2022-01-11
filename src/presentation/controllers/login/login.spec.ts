import { IAuthentication, IAuthenticationModel } from '../../../domain/usecases/protocols/IAuthentication'
import { MissinParamError } from '../../errors'
import { ok, serverError, unauthorized } from '../../helpers/http/http-helper'
import { IHttpRequest, IValidation } from '../../protocols'
import { LoginController } from './login'

class ValidationStub implements IValidation {
  validate (input: any): Error {
    return null
  }
}

class AuthenticationStub implements IAuthentication {
  async auth (authenticationModel: IAuthenticationModel): Promise<string> {
    return 'any_token'
  }
}

interface ISut {
  sut: LoginController
  validationStub: ValidationStub
  authenticationStub: AuthenticationStub
}

const makeValidationStub = (): ValidationStub => {
  return new ValidationStub()
}

const makeAuthenticationStub = (): AuthenticationStub => {
  return new AuthenticationStub()
}

const makeSut = (): ISut => {
  const validationStub = makeValidationStub()

  const authenticationStub = makeAuthenticationStub()

  const sut = new LoginController(authenticationStub, validationStub)

  return {
    sut,
    validationStub,
    authenticationStub
  }
}

const makehttpRequest = (): IHttpRequest => {
  return {
    body: {
      email: 'any_email@mail.com',
      password: 'any_password'
    }
  }
}

describe('Login Controller', () => {
  it('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makehttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse).toEqual(ok({ acessToken: 'any_token' }))
  })
  it('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const httpRequest = makehttpRequest()

    const authSpy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle(httpRequest)

    expect(authSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  it('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    const httpRequest = makehttpRequest()

    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => { throw new Error() })

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  it('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    const httpRequest = makehttpRequest()

    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(null)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse).toEqual(unauthorized())
  })
  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const httpRequest = makehttpRequest()

    const validateSpy = jest.spyOn(validationStub, 'validate')

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    const httpRequest = makehttpRequest()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissinParamError('any_error'))

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamError('any_error'))
  })
})
