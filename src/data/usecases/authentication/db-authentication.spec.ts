import {
  IAccountModel,
  IloadAccountByEmailRepository,
  DbAuthentication,
  IHashComparer,
  ITokenGenerator,
  IUpdateAccessTokenRepository
} from '../authentication/db-authentication-protocols'

class LoadAccountByEmailRepositoryStub implements IloadAccountByEmailRepository {
  async loadByEmail (email: string): Promise<IAccountModel> {
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
  async generate (id: string): Promise<string> {
    return 'any_token'
  }
}

class UpdateAccessTokenRepositoryStub implements IUpdateAccessTokenRepository {
  async updateToken (acessToken: string, id: string): Promise<void> {}
}

interface ISut {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepositoryStub
  hashCompareStub: HashCompareStub
  tokenGeneratorStub: TokenGeneratorStub
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepositoryStub
}
const makeSut = (): ISut => {
  const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
  const hashCompareStub = new HashCompareStub()
  const tokenGeneratorStub = new TokenGeneratorStub()
  const updateAccessTokenRepositoryStub = new UpdateAccessTokenRepositoryStub()
  const sut = new DbAuthentication(tokenGeneratorStub, loadAccountByEmailRepositoryStub, hashCompareStub, updateAccessTokenRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  }
}

interface IInput {
  email: string
  password: string
}

const makeInput = (): IInput => {
  return { email: 'any_email@mail.com', password: 'any_password' }
}

describe('DbAuthenticationUseCase', () => {
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')

    await sut.execute(makeInput())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
  it('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const promise = sut.execute(makeInput())

    await expect(promise).rejects.toThrow()
  })
  it('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null)

    const acessToken = await sut.execute(makeInput())
    expect(acessToken).toBeNull()
  })
  it('Should call HashCompare  with correct password', async () => {
    const { sut, hashCompareStub } = makeSut()

    const compareSpy = jest.spyOn(hashCompareStub, 'compare')

    await sut.execute(makeInput())

    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })
  it('Should throw if HashCompare throws', async () => {
    const { sut, hashCompareStub } = makeSut()

    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const promise = sut.execute(makeInput())

    await expect(promise).rejects.toThrow()
  })
  it('Should return null if HashCompare returns null', async () => {
    const { sut, hashCompareStub } = makeSut()

    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(null)

    const acessToken = await sut.execute(makeInput())
    expect(acessToken).toBeNull()
  })
  it('Should call TokenGenerator if HashCompare returns true', async () => {
    const { sut, tokenGeneratorStub } = makeSut()

    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')

    await sut.execute(makeInput())

    expect(generateSpy).toHaveBeenCalled()
  })
  it('Should call TokenGenerator  with user id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()

    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')

    await sut.execute(makeInput())

    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })
  it('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()

    jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const promise = sut.execute(makeInput())

    await expect(promise).rejects.toThrow()
  })
  it('Should call UpdateAccessTokenRepository with correct acessToken and id', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()

    const loadSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateToken')

    await sut.execute(makeInput())

    expect(loadSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })
  it('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()

    jest.spyOn(updateAccessTokenRepositoryStub, 'updateToken').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )

    const promise = sut.execute(makeInput())

    await expect(promise).rejects.toThrow()
  })
  it('Should return an acessToken on succes', async () => {
    const { sut } = makeSut()

    const acessToken = await sut.execute(makeInput())

    expect(acessToken).toBe('any_token')
  })
})
