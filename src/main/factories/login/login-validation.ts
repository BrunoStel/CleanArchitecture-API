import { EmailValidation } from '../../../presentation/helpers/validator/Email-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validator/Required-field-validation'
import { ValidationComposite } from '../../../presentation/helpers/validator/Validation-composite'
import { IValidation } from '../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: IValidation[] = []

  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
