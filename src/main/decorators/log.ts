import { ILogErrorRepository } from '../../data/protocols/db/ILogErrorRepositoryProtocol'
import { IController, IHttpRequest, IHttpResponse } from '../../presentation/protocols'

export class LogControllerDecoretor implements IController {
  constructor (
    private readonly controller: IController,
    private readonly logErrorRepository: ILogErrorRepository) {
    this.controller = controller
    this.logErrorRepository = logErrorRepository
  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const httReponse = await this.controller.handle(httpRequest)

    if (httReponse.statusCode === 500) {
      await this.logErrorRepository.logError(httReponse.body.stack)
    }
    return httReponse
  }
}
