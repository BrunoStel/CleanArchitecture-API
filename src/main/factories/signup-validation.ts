import { RequiredFieldValidation } from '../../presentation/helpers/validator/Required-field-validation'
import { ValidationComposite } from '../../presentation/helpers/validator/Validation-composite'
import { IValidation } from '../../presentation/protocols'

export const makeSignupValidation = (): ValidationComposite => {
  const validations: IValidation[] = []

  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}