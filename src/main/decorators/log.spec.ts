import { IController, IHttpRequest, IHttpResponse } from '../../presentation/protocols'
import { LogControllerDecoretor } from './log'

class ControllerStub implements IController {
  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const httReponse = {
      statusCode: 200,
      body: ''
    }
    return httReponse
  }
}

interface ISut {
  sut: LogControllerDecoretor
  controllerStub: ControllerStub
}

const makeControllerStub = (): IController => {
  return new ControllerStub()
}

const makeSut = (): ISut => {
  const controllerStub = makeControllerStub()
  const sut = new LogControllerDecoretor(controllerStub)
  return {
    sut,
    controllerStub
  }
}

describe('LogControllerDecoretor', () => {
  it('Should return a HttpResponse with satusCode 200 if the injected class returned a HttpResponse with satusCode 200', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: null
    }
    const httpReponse = await sut.handle(httpRequest)

    expect(httpReponse.statusCode).toBe(200)
  })
})
