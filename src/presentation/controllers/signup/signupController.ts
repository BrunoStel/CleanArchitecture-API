import { IHttpRequest, IHttpResponse, IController, IEmailValidator, IAddAccount, IValidation } from '../../controllers/signup/signupProtocols'
import { MissinParamError, InvalidParamError } from '../../errors/index'
import { badRequest, ok, serverError } from '../../helpers/http-helper'

class SignupController implements IController {
  constructor (
    private readonly emailValidator: IEmailValidator,
    private readonly addAccount: IAddAccount,
    private readonly validation: IValidation
  ) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      this.validation.validate(httpRequest.body)
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      const { name, email, password, passwordConfirmation } = httpRequest.body

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissinParamError(field))
        }
      }

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation is different from password'))
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const account = await this.addAccount.execute({ name, email, password })

      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}

export { SignupController }
