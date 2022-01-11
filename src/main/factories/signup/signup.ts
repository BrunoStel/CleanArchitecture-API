import { DbAddAccountUseCase } from '../../../data/usecases/add-account/db-add-account'
import { BCryptAdapter } from '../../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log'
import { SignupController } from '../../../presentation/controllers/signup/signupController'
import { IController } from '../../../presentation/protocols'
import { LogControllerDecoretor } from '../../decorators/log'
import { makeSignupValidation } from './signup-validation'

export const makeSignupController = (): IController => {
  const salt = 12
  const bcryptAdapter = new BCryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  const addAccount = new DbAddAccountUseCase(bcryptAdapter, addAccountRepository)

  const signupController = new SignupController(addAccount, makeSignupValidation())
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecoretor(signupController, logMongoRepository)
}
