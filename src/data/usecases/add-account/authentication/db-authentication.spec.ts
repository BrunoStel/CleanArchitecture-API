import { IAccountModel } from '../db-add-account-Protocols'
import { IloadAccountByEmailRepository } from '../../protocols/IloadAccountByEmailRepository'
import { DbAuthentication } from './db-authentication'
import { IHashComparer } from '../../protocols/IHashComparer'
import { ITokenGenerator } from '../../protocols/ITokenGenerator'

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

class TokenGeneratorStub implements ITokenGenerator {
  async generate (): Promise<string> {
    return 'any_token'
  }
}

interface ISut {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepositoryStub
  hashCompareStub: HashCompareStub
  tokenGeneratorStub: TokenGeneratorStub
}
const makeSut = (): ISut => {
  const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
  const hashCompareStub = new HashCompareStub()
  const tokenGeneratorStub = new TokenGeneratorStub()
  const sut = new DbAuthentication(tokenGeneratorStub, loadAccountByEmailRepositoryStub, hashCompareStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub
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
  it('Should throw if HashCompare throws', async () => {
    const { sut, hashCompareStub } = makeSut()

    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const promise = sut.execute({ email: 'any_email@mail.com', password: 'any_password' })

    await expect(promise).rejects.toThrow()
  })
  it('Should return null if HashCompare returns null', async () => {
    const { sut, hashCompareStub } = makeSut()

    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(null)

    const acessToken = await sut.execute({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    expect(acessToken).toBeNull()
  })
  it('Should call TokenGenerator if HashCompare returns true', async () => {
    const { sut, tokenGeneratorStub } = makeSut()

    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')

    await sut.execute({ email: 'any_email@mail.com', password: 'any_password' })

    expect(generateSpy).toHaveBeenCalled()
  })
  it('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()

    jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const promise = sut.execute({ email: 'any_email@mail.com', password: 'any_password' })

    await expect(promise).rejects.toThrow()
  })
})
