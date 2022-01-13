import { IAccountModel } from '../db-add-account-Protocols'
import { IloadAccountByEmailRepository } from '../../protocols/IloadAccountByEmailRepository'
import { DbAuthentication } from './db-authentication'
import { IHashComparer } from '../../protocols/IHashComparer'

class LoadAccountByEmailRepositoryStub implements IloadAccountByEmailRepository {
  async load (email: string): Promise<IAccountModel> {
    const account: IAccountModel = {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    }
    return account
  }
}

class HashCompareStub implements IHashComparer {
  async compare (value: string, hash: string): Promise<boolean> {
    return true
  }
}

interface ISut {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepositoryStub
  hashCompareStub: HashCompareStub
}
const makeSut = (): ISut => {
  const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
  const hashCompareStub = new HashCompareStub()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashCompareStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub
  }
}

describe('DbAuthenticationUseCase', () => {
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')

    await sut.execute({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
  it('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const promise = sut.execute({ email: 'any_email@mail.com', password: 'any_password' })

    await expect(promise).rejects.toThrow()
  })
  it('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null)

    const acessToken = await sut.execute({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    expect(acessToken).toBeNull()
  })
  it('Should call HashCompare  with correct password', async () => {
    const { sut, hashCompareStub } = makeSut()

    const compareSpy = jest.spyOn(hashCompareStub, 'compare')

    await sut.execute({
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })
})
