import { MissinParamError } from '../../errors'
import { IController, IHttpRequest, IHttpResponse } from '../../protocols'

export class LoginController implements IController {
  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const params = ['email', 'password']

    for (const param of params) {
      if (!httpRequest[param]) {
        return {
          statusCode: 400,
          body: new MissinParamError(param)
        }
      }
    }
  }
}
