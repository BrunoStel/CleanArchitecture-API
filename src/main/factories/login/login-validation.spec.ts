import { EmailValidation } from '../../../presentation/helpers/validator/Email-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validator/Required-field-validation'
import { ValidationComposite } from '../../../presentation/helpers/validator/Validation-composite'
import { IEmailValidator, IValidation } from '../../../presentation/protocols'
import { makeLoginValidation } from './login-validation'

jest.mock('../../../presentation/helpers/validator/Validation-composite')

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

describe('LoginValidation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()

    const validations: IValidation[] = []

    const emailValidator = makeEmailValidator()

    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new EmailValidation('email', emailValidator))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
