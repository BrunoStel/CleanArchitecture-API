import { BCryptAdapter } from './bcrypt-adapter'
import bcryptjs from 'bcryptjs'

interface ITypeSut {
  sut: BCryptAdapter
  salt: number
}

jest.mock('bcryptjs', () => ({
  async hash (): Promise<string> {
    return 'hash'
  },
  async compare (): Promise<Boolean> {
    return true
  }
}))

const makeSut = (): ITypeSut => {
  const salt = 12
  const sut = new BCryptAdapter(salt)

  return {
    sut,
    salt
  }
}

describe('BCryptAdapter', () => {
  it('Should call hash with correct value', async () => {
    const { sut, salt } = makeSut()
    const hashSpy = jest.spyOn(bcryptjs, 'hash')

    const password = 'valid_password'

    await sut.hash(password)

    expect(hashSpy).toHaveBeenLastCalledWith(password, salt)
  })
  it('Should return a valid hash on hash succes', async () => {
    const { sut } = makeSut()

    const password = 'valid_password'

    const hash = await sut.hash(password)

    expect(hash).toBe('hash')
  })
  it('Should throws if bcryptjs throws', async () => {
    const { sut } = makeSut()

    jest.spyOn(sut, 'hash').mockResolvedValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const password = 'valid_password'
    const promise = sut.hash(password)

    await expect(promise).rejects.toThrow()
  })
  it('Should call compare with correct value', async () => {
    const { sut } = makeSut()
    const compareSpy = jest.spyOn(bcryptjs, 'compare')

    await sut.compare('any_value', 'any_hash')

    expect(compareSpy).toHaveBeenLastCalledWith('any_value', 'any_hash')
  })
  it('Should return a true when compare succeeds', async () => {
    const { sut } = makeSut()

    const isValid = await sut.compare('any_value', 'any_hash')

    expect(isValid).toBe(true)
  })
})
