import { IAccountModel } from '../add-account/db-add-account-Protocols'
import { IloadAccountByEmailRepository } from '../protocols/IloadAccountByEmailRepository'
import { DbAuthentication } from './db-authentication'

class LoadAccountByEmailRepositoryStub implements IloadAccountByEmailRepository {
  async load (email: string): Promise<IAccountModel> {
    const account: IAccountModel = {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }
    return account
  }
}

interface ISut {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepositoryStub
}
const makeSut = (): ISut => {
  const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub
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
})
