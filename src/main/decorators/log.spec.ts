import { ILogErrorRepository } from '../../data/usecases/protocols/ILogErrorRepositoryProtocol'
import { serverError } from '../../presentation/helpers/http-helper'
import { IController, IHttpRequest, IHttpResponse } from '../../presentation/protocols'
import { LogControllerDecoretor } from './log'

class LogErrorRepositoryStub implements ILogErrorRepository {
  async logError (stackError: string): Promise<void> {
  }
}

class ControllerStub implements IController {
  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const httReponse = {
      statusCode: 200,
      body: {
        name: 'any_name'
      }
    }
    return httReponse
  }
}

interface ISut {
  sut: LogControllerDecoretor
  controllerStub: ControllerStub
  logErrorRepositoryStub: LogErrorRepositoryStub
}

const makeControllerStub = (): IController => {
  return new ControllerStub()
}

const makeErrorRepository = (): ILogErrorRepository => {
  return new LogErrorRepositoryStub()
}

const makeSut = (): ISut => {
  const controllerStub = makeControllerStub()
  const logErrorRepositoryStub = makeErrorRepository()
  const sut = new LogControllerDecoretor(controllerStub, logErrorRepositoryStub)
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogControllerDecoretor', () => {
  it('Should call injected controller handle ', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    const httpRequest: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
  it('Should return a HttpResponse with satusCode 200 if the injected controller returns a HttpResponse with satusCode 200', async () => {
    const { sut } = makeSut()
    const httpRequest: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpReponse = await sut.handle(httpRequest)

    expect(httpReponse.statusCode).toBe(200)
    expect(httpReponse.body).toEqual({
      name: 'any_name'
    })
  })
  it('Should call LogErrorRepository with correct error if the injected controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const error = serverError(fakeError)

    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)))

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')

    const httpRequest: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    await sut.handle(httpRequest)

    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
