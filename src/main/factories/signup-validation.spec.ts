import { RequiredFieldValidation } from '../../presentation/helpers/validator/Required-field-validation'
import { ValidationComposite } from '../../presentation/helpers/validator/Validation-composite'
import { IValidation } from '../../presentation/protocols'
import { makeSignupValidation } from './signup-validation'

jest.mock('../../presentation/helpers/validator/Validation-composite')

describe('SignupValidation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeSignupValidation()

    const validations: IValidation[] = []

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
