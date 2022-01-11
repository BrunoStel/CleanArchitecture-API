import { CompareFieldsValidation, RequiredFieldValidation, ValidationComposite, EmailValidation } from '../../../presentation/helpers/validator/'
import { IEmailValidator, IValidation } from '../../../presentation/protocols'
import { makeSignupValidation } from './signup-validation'

jest.mock('../../../presentation/helpers/validator/Validation-composite')

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

describe('SignupValidation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeSignupValidation()

    const validations: IValidation[] = []

    const emailValidator = makeEmailValidator()

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))

    validations.push(new EmailValidation('email', emailValidator))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
