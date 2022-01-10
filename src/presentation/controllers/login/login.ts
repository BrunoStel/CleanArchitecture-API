import { InvalidParamError, MissinParamError } from '../../errors'
import { badRequest, ok } from '../../helpers/http-helper'
import { IController, IEmailValidator, IHttpRequest, IHttpResponse } from '../../protocols'

export class LoginController implements IController {
  constructor (
    private readonly emailValidator: IEmailValidator
  ) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const requiredFields = ['email', 'password']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissinParamError(field))
      }
    }

    const isValid = this.emailValidator.isValid(httpRequest.body.email)

    if (!isValid) {
      return badRequest(new InvalidParamError(httpRequest.body.email))
    }

    return ok('any_data')
  }
}
