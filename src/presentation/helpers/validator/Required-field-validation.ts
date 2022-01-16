import { MissinParamError } from '../../errors'
import { IValidation } from '../../protocols/IValidationProtocol'

export class RequiredFieldValidation implements IValidation {
  constructor (private readonly fieldName: string) {}

  validate (input: any): Error {
    if (!input[this.fieldName]) {
      return new MissinParamError(this.fieldName)
    }
    return null
  }
}
