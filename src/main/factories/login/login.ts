import env from '../../config/env'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { BCryptAdapter } from '../../../infra/criptography/bcryptadapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log'
import { LoginController } from '../../../presentation/controllers/login/login'
import { IController } from '../../../presentation/protocols'
import { LogControllerDecoretor } from '../../decorators/log'
import { makeLoginValidation } from './login-validation'

export const makeLoginController = (): IController => {
  const salt = 12
  const tokenGenerator = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  const hashCompare = new BCryptAdapter(salt)
  const authentication = new DbAuthentication(tokenGenerator, accountMongoRepository, hashCompare, accountMongoRepository)
  const loginController = new LoginController(authentication, makeLoginValidation())

  const logMongoRepository = new LogMongoRepository()

  return new LogControllerDecoretor(loginController, logMongoRepository)
}
