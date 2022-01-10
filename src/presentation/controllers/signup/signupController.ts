import { IHttpRequest, IHttpResponse, IController, IAddAccount, IValidation } from '../../controllers/signup/signupProtocols'
import { badRequest, ok, serverError } from '../../helpers/http-helper'

class SignupController implements IController {
  constructor (
    private readonly addAccount: IAddAccount,
    private readonly validation: IValidation
  ) {
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body

      const account = await this.addAccount.execute({ name, email, password })

      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}

export { SignupController }
