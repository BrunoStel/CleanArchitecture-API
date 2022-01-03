import { IHttpRequest, IHttpResponse } from '../protocols/IHtpp'
import { MissinParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { IController } from '../protocols/IController'
import { IEmailValidator } from '../protocols/IEmailValidator'
import { InvalidParamError } from '../errors/invalid-param-error'

class SignupController implements IController {
  private readonly emailValidator: IEmailValidator

  constructor (emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: IHttpRequest): IHttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissinParamError(field))
      }
    }
    const isValid = this.emailValidator.isValid(httpRequest.body.email)
    if (!isValid) {
      return badRequest(new InvalidParamError('email'))
    }
  }
}

export { SignupController }
