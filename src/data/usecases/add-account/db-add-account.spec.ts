import { DbAddAccount } from './db-add-account'
import { IAddAccount, IAddAccountModel, IAccountModel, IEncrypter, IAddAccountRepository } from './db-add-account-Protocols'

interface IStuTypes {
  encryoterStub: IEncrypter
  sut: IAddAccount
  addAccountRepositoryStub: IAddAccountRepository
}

class EncrypterStub implements IEncrypter {
  async encrypt (value: string): Promise<string> {
    return 'hashed_password'
  }
}

class AddAccountRepositoryStub implements IAddAccountRepository {
  async add (accountData: IAddAccountModel): Promise<IAccountModel> {
    const fakeAccount = {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    }
    return fakeAccount
  }
}

const makeAddAccountRepositoryStub = (): IAddAccountRepository => {
  return new AddAccountRepositoryStub()
}

const makeEncrypterStub = (): IEncrypter => {
  return new EncrypterStub()
}

const makeSut = (): IStuTypes => {
  const encryoterStub = makeEncrypterStub()

  const addAccountRepositoryStub = makeAddAccountRepositoryStub()

  const sut = new DbAddAccount(encryoterStub, addAccountRepositoryStub)

  return {
    encryoterStub,
    sut,
    addAccountRepositoryStub
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
  it('Should return an Account with valid data', async () => {
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
      password: 'hashed_password'
    })
  })
  it('Should call AddAccountRepository with valid data ', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    const data = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }

    await sut.add(data)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })
  it('Should throw if AddAccountRepository throws ', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    jest.spyOn(addAccountRepositoryStub, 'add').mockResolvedValueOnce(
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
})
