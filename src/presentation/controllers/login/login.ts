import { IAuthentication } from '../../../domain/usecases/protocols/IAuthentication'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http-helper'
import { IController, IHttpRequest, IHttpResponse, IValidation } from '../../protocols'

export class LoginController implements IController {
  constructor (
    private readonly authentication: IAuthentication,
    private readonly validation: IValidation
  ) {
    this.authentication = authentication
    this.validation = validation
  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const token = await this.authentication.execute(httpRequest.body)
      if (!token) {
        return unauthorized()
      }

      return ok({ acessToken: token })
    } catch (error) {
      return serverError(error)
    }
  }
}
