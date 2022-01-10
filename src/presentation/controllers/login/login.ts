import { IAuthentication } from '../../../domain/usecases/protocols/IAuthentication'
import { InvalidParamError, MissinParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { IController, IEmailValidator, IHttpRequest, IHttpResponse } from '../../protocols'

export class LoginController implements IController {
  constructor (
    private readonly emailValidator: IEmailValidator,
    private readonly authentication: IAuthentication
  ) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const requiredFields = ['email', 'password']

      const { email, password } = httpRequest.body

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissinParamError(field))
        }
      }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError(email))
      }
      const token = await this.authentication.auth(email, password)

      return ok(token)
    } catch (error) {
      return serverError(error)
    }
  }
}
