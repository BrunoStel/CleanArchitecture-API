import { IHasher } from '../../data/protocols/criptography/IHasherProtocols'
import { BCryptAdapter } from './bcrypt-adapter'
import bcryptjs from 'bcryptjs'

interface ITypeSut {
  sut: IHasher
  salt: number
}

jest.mock('bcryptjs', () => ({
  async hash (): Promise<string> {
    return 'hash'
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

describe('Bcrypt Adapter', () => {
  it('Should call bcryptjs with correct value', async () => {
    const { sut, salt } = makeSut()
    const hashSpy = jest.spyOn(bcryptjs, 'hash')

    const password = 'valid_password'

    await sut.hash(password)

    expect(hashSpy).toHaveBeenLastCalledWith(password, salt)
  })
  it('Should return a hash on succes', async () => {
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
})
