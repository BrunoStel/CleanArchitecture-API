import { IHttpRequest, IHttpResponse } from '../protocols/IHtpp'
import { MissinParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'

class SignupController {
  handle (httpRequest: IHttpRequest): IHttpResponse {
    if (!httpRequest.body.name) {
      return badRequest(new MissinParamError('name'))
    }

    if (!httpRequest.body.email) {
      return badRequest(new MissinParamError('email'))
    }
  }
}

export { SignupController }
