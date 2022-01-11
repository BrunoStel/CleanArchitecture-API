import { InvalidParamError, MissinParamError } from '../../errors'
import { IValidation } from './IValidationProtocol'
import { ValidationComposite } from './Validation-composite'

interface ISutTypes {
  sut: ValidationComposite
  validationsStub: IValidation[]
}

const makeValidationFakeStub = (): IValidation => {
  class ValidationFakeStub implements IValidation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationFakeStub()
}

const makeSut = (): ISutTypes => {
  const validationFakeStub = makeValidationFakeStub()
  const validationFakeStub2 = makeValidationFakeStub()
  const validationsStub = [validationFakeStub, validationFakeStub2]
  const sut = new ValidationComposite(validationsStub)
  return {
    sut,
    validationsStub
  }
}

describe('Validation composite', () => {
  it('should throw the same error that validation throws', () => {
    const { sut, validationsStub } = makeSut()

    jest.spyOn(validationsStub[1], 'validate').mockReturnValueOnce(new MissinParamError('fake_param'))

    const error = sut.validate({})

    expect(error).toEqual(new MissinParamError('fake_param'))
  })
  it('should return null if validations return null', () => {
    const { sut } = makeSut()

    const response = sut.validate({})
    expect(response).toBe(null)
  })
  it('should throw the first error if more than one validation fails', () => {
    const { sut, validationsStub } = makeSut()

    jest.spyOn(validationsStub[1], 'validate').mockReturnValueOnce(new MissinParamError('fake_param'))
    jest.spyOn(validationsStub[0], 'validate').mockReturnValueOnce(new InvalidParamError('invalid_param'))

    const error = sut.validate({})

    expect(error).toEqual(new InvalidParamError('invalid_param'))
  })
})
