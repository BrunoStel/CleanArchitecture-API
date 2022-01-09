import { IController, IHttpRequest, IHttpResponse } from '../../presentation/protocols'

export class LogControllerDecoretor implements IController {
  constructor (private readonly controller: IController) {
    this.controller = controller
  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const httReponse = await this.controller.handle(httpRequest)
    if (httReponse.statusCode === 500) {
      return null
    }
    return httReponse
  }
}
