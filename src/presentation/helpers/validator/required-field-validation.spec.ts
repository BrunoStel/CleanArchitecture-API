import { MissinParamError } from '../../errors'
import { RequiredFieldValidation } from './Required-field-validation'

interface ISutTypes {
  sut: RequiredFieldValidation
}

const makeSut = (): ISutTypes => {
  const sut = new RequiredFieldValidation('any_field')
  return {
    sut
  }
}

describe('Required field validation', () => {
  it('should throw new MissingParamError if validation fails', () => {
    const { sut } = makeSut()

    const isValid = sut.validate({})

    expect(isValid).toEqual(new MissinParamError('any_field'))
    expect(sut.validate).toThrow()
  })
  it('should return null if the field in verification is tested', () => {
    const { sut } = makeSut()

    const response = sut.validate({ any_field: 'any_field' })

    expect(response).toBe(null)
  })
})
