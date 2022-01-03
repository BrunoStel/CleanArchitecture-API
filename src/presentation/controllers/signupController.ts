import { IHttpRequest, IHttpResponse } from '../protocols/IHtpp'
import { MissinParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'

class SignupController {
  handle (httpRequest: IHttpRequest): IHttpResponse {
    const requiredFields = ['name', 'email']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissinParamError(field))
      }
    }
  }
}

export { SignupController }
