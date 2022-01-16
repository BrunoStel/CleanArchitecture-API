import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

interface ITypeSut {
  sut: AccountMongoRepository
}

const makeSut = (): ITypeSut => {
  const sut = new AccountMongoRepository()

  return {
    sut
  }
}

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  it('Should return an account on add success', async () => {
    const { sut } = makeSut()

    const accountData = {
      name: 'valid_name',
      email: 'valid_mail',
      password: 'hashed_password'
    }

    const account = await sut.add(accountData)

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('valid_name')
    expect(account.email).toBe('valid_mail')
    expect(account.password).toBe('hashed_password')
  })
  it('Should return an account on loadByEmail success', async () => {
    const { sut } = makeSut()

    const accountData = {
      name: 'valid_name',
      email: 'valid_mail',
      password: 'hashed_password'
    }

    await sut.add(accountData)

    const account = await sut.loadByEmail('valid_mail')

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('valid_name')
    expect(account.email).toBe('valid_mail')
    expect(account.password).toBe('hashed_password')
  })
  it('Should return null if loadByEmail returns null', async () => {
    const { sut } = makeSut()

    const accountData = {
      name: 'valid_name',
      email: 'valid_mail',
      password: 'hashed_password'
    }

    await sut.add(accountData)

    const account = await sut.loadByEmail('valid_email')

    expect(account).toBeNull()
  })
})
