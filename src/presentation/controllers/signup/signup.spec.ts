import { ServerError } from '../../errors/index'
import { IAccountModel, IAddAccount, IAddAccountModel, IHttpRequest, IValidation } from './signupProtocols'
import { SignupController } from './signupController'
import { badRequest } from '../../helpers/http/http-helper'

interface ISutTypes {
  sut: SignupController
  addAccountStub: IAddAccount
  validationStub: IValidation
}

const makeValidationStub = (): IValidation => {
  class ValidationStub implements IValidation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
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
  const addAccountStub = makeAddAccount()

  const validationStub = makeValidationStub()

  const sut = new SignupController(addAccountStub, validationStub)
  return {
    sut,
    addAccountStub,
    validationStub
  }
}

const makeHttpRequest = (): IHttpRequest => {
  const httpRequest = {
    body: {
      email: 'any_email@any.com',
      name: 'any_name',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  }
  return httpRequest
}

describe('signup controller', () => {
  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const executeSpy = jest.spyOn(addAccountStub, 'execute')

    const httpRequest = makeHttpRequest()

    await sut.handle(httpRequest)

    expect(executeSpy).toHaveBeenCalledWith({
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

    const httpRequest = makeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError('error'))
  })

  it('should return status 200 if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = makeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      email: 'valid_email@mail.com',
      name: 'valid_name',
      password: 'valid_password'
    })
  })
  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeHttpRequest()

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  it('should return status 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()

    const httpRequest = makeHttpRequest()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new Error()))
  })
})
