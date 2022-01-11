import { DbAddAccountUseCase } from './db-add-account'
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

  const sut = new DbAddAccountUseCase(encryoterStub, addAccountRepositoryStub)

  return {
    encryoterStub,
    sut,
    addAccountRepositoryStub
  }
}

const makeAccountData = (): IAddAccountModel => {
  const accountData = {
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password'
  }
  return accountData
}

describe('DbAddAccount UseCase', () => {
  it('Should call Encrypter with correct password ', async () => {
    const { sut, encryoterStub } = makeSut()

    const encryptSpy = jest.spyOn(encryoterStub, 'encrypt')
    const accountData = makeAccountData()

    await sut.execute(accountData)

    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })
  it('Should throw if Encrypter throws ', async () => {
    const { sut, encryoterStub } = makeSut()

    jest.spyOn(encryoterStub, 'encrypt').mockResolvedValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const accountData = makeAccountData()

    const promise = sut.execute(accountData)

    await expect(promise).rejects.toThrow()
  })
  it('Should return an Account on succes', async () => {
    const { sut } = makeSut()
    const accountData = makeAccountData()

    const account = await sut.execute(accountData)

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

    const accountData = makeAccountData()

    await sut.execute(accountData)

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

    const accountData = makeAccountData()

    const promise = sut.execute(accountData)

    await expect(promise).rejects.toThrow()
  })
})
