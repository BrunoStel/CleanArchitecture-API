import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BCryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { SignupController } from '../../presentation/controllers/signup/signupController'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'

export const makeSignupController = (): SignupController => {
  const salt = 12
  const bcryptAdapter = new BCryptAdapter(salt)
  const addAccountRepositoru = new AccountMongoRepository()
  const addAccount = new DbAddAccount(bcryptAdapter, addAccountRepositoru)

  const emailValidator = new EmailValidatorAdapter()
  return new SignupController(emailValidator, addAccount)
}
