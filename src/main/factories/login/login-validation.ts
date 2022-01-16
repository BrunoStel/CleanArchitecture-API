import { RequiredFieldValidation, ValidationComposite, EmailValidation } from '../../../presentation/helpers/validator/'
import { IValidation } from '../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../adapter/validators/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: IValidation[] = []

  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
