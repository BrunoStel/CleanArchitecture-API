import { IAddAccount } from '../../../domain/usecases/protocols/IAddAccount'
import { IEncrypter } from '../protocols/IEncrypterProtocols'
import { DbAddAccount } from './db-add-account'

interface IStuTypes {
  encryoterStub: IEncrypter
  sut: IAddAccount
}

class EncrypterStub implements IEncrypter {
  async encrypt (value: string): Promise<string> {
    return 'hashed_password'
  }
}

const makeEncrypterStub = (): IEncrypter => {
  return new EncrypterStub()
}

const makeSut = (): IStuTypes => {
  const encryoterStub = makeEncrypterStub()

  const sut = new DbAddAccount(encryoterStub)

  return {
    encryoterStub,
    sut
  }
}

describe('DbAddAccount UseCase', () => {
  it('Should call Encrypter with correct password ', async () => {
    const { sut, encryoterStub } = makeSut()

    const encryptSpy = jest.spyOn(encryoterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(accountData)

    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })
  it('Should throw if Encrypter throws ', async () => {
    const { sut, encryoterStub } = makeSut()

    jest.spyOn(encryoterStub, 'encrypt').mockResolvedValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrow()
  })
  it('Should return an Account if valid data is provided ', async () => {
    const { sut } = makeSut()
    const data = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const account = await sut.add(data)

    expect(account).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    })
  })
})