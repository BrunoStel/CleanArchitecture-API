import { IEncrypter } from '../../data/usecases/protocols/IEncrypterProtocols'
import { BCryptAdapter } from './bcrypt-adapter'
import bcryptjs from 'bcryptjs'

interface ITypeSut {
  sut: IEncrypter
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

    await sut.encrypt(password)

    expect(hashSpy).toHaveBeenLastCalledWith(password, salt)
  })
  it('Should return a hash on succes', async () => {
    const { sut } = makeSut()

    const password = 'valid_password'

    const hash = await sut.encrypt(password)

    expect(hash).toBe('hash')
  })
})
