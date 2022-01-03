import { IHttpRequest, IHttpResponse } from '../protocols/IHtpp'
import { MissinParamError } from '../errors/missing-param-error'

class SignupController {
  handle (httpRequest: IHttpRequest): IHttpResponse {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new MissinParamError('name')
      }
    }

    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new MissinParamError('email')
      }
    }
  }
}

export { SignupController }
