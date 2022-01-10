import { IAuthentication } from '../../../domain/usecases/protocols/IAuthentication'
import { serverError, unauthorized } from '../../helpers/http-helper'
import { IEmailValidator, IHttpRequest } from '../../protocols'
import { LoginController } from './login'

class EmailValidatorStub implements IEmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

class AuthenticationStub implements IAuthentication {
  async auth (email: string, password: string): Promise<string> {
    return 'any_token'
  }
}

interface ISut {
  sut: LoginController
  emailValidatorStub: EmailValidatorStub
  authenticationStub: AuthenticationStub
}

const makeEmailValidatorStub = (): EmailValidatorStub => {
  return new EmailValidatorStub()
}

const makeAuthenticationStub = (): AuthenticationStub => {
  return new AuthenticationStub()
}

const makeSut = (): ISut => {
  const emailValidatorStub = makeEmailValidatorStub()

  const authenticationStub = makeAuthenticationStub()

  const sut = new LoginController(emailValidatorStub, authenticationStub)

  return {
    sut,
    emailValidatorStub,
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
  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.name).toEqual('MissinParamERROR: email')
  })
  it('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.name).toEqual('MissinParamERROR: password')
  })
  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = makehttpRequest()

    const isValid = jest.spyOn(emailValidatorStub, 'isValid')

    await sut.handle(httpRequest)

    expect(isValid).toHaveBeenCalledWith('any_email@mail.com')
  })
  it('Should return 400 if invalid email is passed', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = {
      body: {
        email: 'incorrect_email@mail.com',
        password: 'any_password'
      }
    }

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.name).toEqual('InvalidParamERROR: incorrect_email@mail.com')
  })
  it('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makehttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
  })
  it('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = makehttpRequest()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  it('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const httpRequest = makehttpRequest()

    const authSpy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle(httpRequest)

    expect(authSpy).toHaveBeenCalledWith(httpRequest.body.email, httpRequest.body.password)
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
})
