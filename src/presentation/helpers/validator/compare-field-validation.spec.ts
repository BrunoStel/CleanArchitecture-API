import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'

interface ISutTypes {
  sut: CompareFieldsValidation
}

const makeSut = (): ISutTypes => {
  const sut = new CompareFieldsValidation('password', 'passwordConfirmation')
  return {
    sut
  }
}

describe('Compare field validation', () => {
  it('should throw new InvalidParamError if validation fails', () => {
    const { sut } = makeSut()

    const isValid = sut.validate({ password: 'password', passwordConfirmation: 'Diffpassword' })

    expect(isValid).toEqual(new InvalidParamError('passwordConfirmation'))
    expect(sut.validate).toThrow()
  })
  it('should return null if the comparation pass the test', () => {
    const { sut } = makeSut()

    const response = sut.validate({ password: 'password', passwordConfirmation: 'password' })

    expect(response).toBe(null)
  })
})
