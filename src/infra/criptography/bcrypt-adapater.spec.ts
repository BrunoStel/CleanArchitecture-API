import { IEncrypter } from '../../data/usecases/protocols/IEncrypterProtocols'
import { BCryptAdapter } from './bcrypt-adapter'
import bcryptjs from 'bcryptjs'

interface ITypeSut {
  sut: IEncrypter
  salt: number
}

const makeSut = (): ITypeSut => {
  const salt = 12
  const sut = new BCryptAdapter(salt)

  return {
    sut,
    salt
  }
}

describe('Bcrypt Adapter', () => {
  it('Should call bcrypt with correct value', async () => {
    const { sut, salt } = makeSut()
    const hashSpy = jest.spyOn(bcryptjs, 'hash')

    const password = 'valid_password'

    await sut.encrypt(password)

    expect(hashSpy).toHaveBeenLastCalledWith(password, salt)
  })
})
