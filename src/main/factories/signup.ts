import { DbAddAccountUseCase } from '../../data/usecases/add-account/db-add-account'
import { BCryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { SignupController } from '../../presentation/controllers/signup/signupController'
import { IController, IValidation } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { LogControllerDecoretor } from '../decorators/log'

class ValidationStub implements IValidation {
  validate (input: any): Error {
    return null
  }
}

export const makeSignupController = (): IController => {
  const salt = 12
  const bcryptAdapter = new BCryptAdapter(salt)
  const addAccountRepositoru = new AccountMongoRepository()
  const addAccount = new DbAddAccountUseCase(bcryptAdapter, addAccountRepositoru)
  const validationStub = new ValidationStub()

  const emailValidator = new EmailValidatorAdapter()
  const signupController = new SignupController(emailValidator, addAccount, validationStub)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecoretor(signupController, logMongoRepository)
}
