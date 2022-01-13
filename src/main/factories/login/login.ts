import { IAuthentication, IAuthenticationModel } from '../../../domain/usecases/protocols/IAuthentication'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log'
import { LoginController } from '../../../presentation/controllers/login/login'
import { IController } from '../../../presentation/protocols'
import { LogControllerDecoretor } from '../../decorators/log'
import { makeLoginValidation } from './login-validation'

class AuthenticationStub implements IAuthentication {
  async execute (authenticationModel: IAuthenticationModel): Promise<string> {
    return 'any_token'
  }
}

export const makeLoginController = (): IController => {
  const authenticationStub = new AuthenticationStub()
  const loginController = new LoginController(authenticationStub, makeLoginValidation())

  const logMongoRepository = new LogMongoRepository()

  return new LogControllerDecoretor(loginController, logMongoRepository)
}
