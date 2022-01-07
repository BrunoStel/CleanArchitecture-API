import { MissinParamError, InvalidParamError, ServerError } from '../../errors/index'
import { IEmailValidator, IAccountModel, IAddAccount, IAddAccountModel } from './signupProtocols'
import { SignupController } from './signupController'

interface ISutTypes {
  sut: SignupController
  emailValidatorStub: IEmailValidator
  addAccountStub: IAddAccount
}

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAddAccount = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    async execute (account: IAddAccountModel): Promise<IAccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }
      return fakeAccount
    }
  }

  return new AddAccountStub()
}

const makeSut = (): ISutTypes => {
  const emailValidatorStub = makeEmailValidator()

  const addAccountStub = makeAddAccount()

  const sut = new SignupController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('signup controller', () => {
  it('should return status 400 if no name is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@any.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamError('name'))
  })

  it('should return status 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamError('email'))
  })

  it('should return status 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@any.com',
        name: 'any_name',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamError('password'))
  })

  it('should return status 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@any.com',
        name: 'any_name',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamError('passwordConfirmation'))
  })

  it('should return status 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        email: 'invalid_email@any.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        email: 'any_email@any.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    await sut.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('any_email@any.com')
  })

  it('should return status 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        email: 'any_email@any.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should return status 400 if password and passwordConfirmation is different from each other', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@any.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password_diff'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation is different from password'))
  })

  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'execute')

    const httpRequest = {
      body: {
        email: 'any_email@any.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    await sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith({
      email: 'any_email@any.com',
      name: 'any_name',
      password: 'any_password'
    })
  })

  it('should return status 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'execute').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        email: 'any_email@any.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should return status 200 if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'valid_email@mail.com',
        name: 'valid_name',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      email: 'valid_email@mail.com',
      name: 'valid_name',
      password: 'valid_password'
    })
  })
})
