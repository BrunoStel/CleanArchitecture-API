import { InvalidParamError } from '../../errors'
import { IValidation } from './IValidationProtocol'

export class CompareFieldsValidation implements IValidation {
  constructor (private readonly fieldName: string, private readonly fieldToComparename: string) {
    this.fieldName = fieldName
    this.fieldToComparename = fieldToComparename
  }

  validate (input: any): Error {
    if (input[this.fieldName] !== input[this.fieldToComparename]) {
      return new InvalidParamError(this.fieldToComparename)
    }
    return null
  }
}
