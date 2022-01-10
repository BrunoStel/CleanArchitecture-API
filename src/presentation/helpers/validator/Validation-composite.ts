import { IValidation } from './IValidationProtocol'

export class ValidationComposite implements IValidation {
  constructor (private readonly validations: IValidation[]) {
    this.validations = validations
  }

  validate (input: any): Error {
    for (const validation of this.validations) {
      const error = validation.validate(input)
      if (error) {
        return error
      }
    }
    return null
  }
}
