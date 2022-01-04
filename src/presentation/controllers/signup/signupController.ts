import { IHttpRequest, IHttpResponse, IController, IEmailValidator, IAddAccount } from '../../controllers/signup/signupProtocols'
import { MissinParamError, InvalidParamError } from '../../errors/index'
import { badRequest, ok, serverError } from '../../helpers/http-helper'

class SignupController implements IController {
  private readonly emailValidator: IEmailValidator
  private readonly addAccount: IAddAccount

  constructor (
    emailValidator: IEmailValidator,
    addAccount: IAddAccount
  ) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissinParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation is different from password'))
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const account = await this.addAccount.add({ name, email, password })

      return ok(account)
    } catch (error) {
      return serverError()
    }
  }
}

export { SignupController }
