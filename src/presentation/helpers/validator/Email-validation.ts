import { InvalidParamError } from '../../errors'
import { IEmailValidator } from '../../protocols'
import { IValidation } from './IValidationProtocol'

export class EmailValidation implements IValidation {
  constructor (private readonly fieldName: string,
    private readonly emailValidator: IEmailValidator) {
    this.fieldName = fieldName
    this.emailValidator = emailValidator
  }

  validate (input: any): Error {
    const isValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
