import { CompareFieldsValidation, RequiredFieldValidation, ValidationComposite, EmailValidation } from '../../../presentation/helpers/validator/'
import { IValidation } from '../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../adapter/validators/email-validator-adapter'

export const makeSignupValidation = (): ValidationComposite => {
  const validations: IValidation[] = []

  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
